package main

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

// configuration captures the plugin's external configuration as exposed in the Mattermost server
// configuration, as well as values computed from the configuration. Any public fields will be
// deserialized from the Mattermost server configuration in OnConfigurationChange.
type configuration struct {
	Enabled      bool
	ChannelRules string
	BlockMessage string
	AdminBypass  bool

	// channelRulesMap is a parsed version of ChannelRules
	channelRulesMap map[string][]string
}

// Clone creates a deep copy of the configuration
func (c *configuration) Clone() *configuration {
	var clone = *c
	return &clone
}

// getConfiguration retrieves the active configuration under lock
func (p *Plugin) getConfiguration() *configuration {
	p.configurationLock.RLock()
	defer p.configurationLock.RUnlock()

	if p.configuration == nil {
		return &configuration{}
	}

	return p.configuration
}

// setConfiguration replaces the active configuration under lock
func (p *Plugin) setConfiguration(configuration *configuration) {
	p.configurationLock.Lock()
	defer p.configurationLock.Unlock()

	if configuration != nil && configuration != p.configuration {
		// Parse channel rules JSON
		if configuration.ChannelRules != "" {
			var rules map[string][]string
			if err := json.Unmarshal([]byte(configuration.ChannelRules), &rules); err != nil {
				p.API.LogError("Failed to parse channel rules", "error", err.Error())
				configuration.channelRulesMap = make(map[string][]string)
			} else {
				configuration.channelRulesMap = rules
			}
		} else {
			configuration.channelRulesMap = make(map[string][]string)
		}
	}

	p.configuration = configuration
}

// OnConfigurationChange is invoked when configuration changes may have been made.
func (p *Plugin) OnConfigurationChange() error {
	var configuration = new(configuration)

	// Load the public configuration fields from the Mattermost server configuration.
	if err := p.API.LoadPluginConfiguration(configuration); err != nil {
		return fmt.Errorf("failed to load plugin configuration: %w", err)
	}

	p.setConfiguration(configuration)

	return nil
}

// OnActivate is invoked when the plugin is activated.
func (p *Plugin) OnActivate() error {
	p.API.LogInfo("Channel Access Control plugin activated")
	return nil
}

// MessageWillBePosted is invoked when a message is posted by a user before it is committed to the database.
func (p *Plugin) MessageWillBePosted(c *plugin.Context, post *model.Post) (*model.Post, string) {
	configuration := p.getConfiguration()

	// If plugin is not enabled, allow all posts
	if !configuration.Enabled {
		return post, ""
	}

	// Check if this channel has access restrictions
	allowedUsers, hasRestrictions := configuration.channelRulesMap[post.ChannelId]
	if !hasRestrictions {
		// No restrictions for this channel, allow post
		return post, ""
	}

	// Check if admin bypass is enabled and user is a system admin
	if configuration.AdminBypass {
		user, err := p.API.GetUser(post.UserId)
		if err != nil {
			p.API.LogError("Failed to get user", "user_id", post.UserId, "error", err.Error())
		} else {
			if user.IsSystemAdmin() {
				p.API.LogDebug("System admin bypassing channel restriction", "user_id", post.UserId, "channel_id", post.ChannelId)
				return post, ""
			}
		}
	}

	// Check if user is in the whitelist
	userAllowed := false
	for _, allowedUserID := range allowedUsers {
		if allowedUserID == post.UserId {
			userAllowed = true
			break
		}
	}

	if !userAllowed {
		// User is not allowed to post in this channel
		p.API.LogInfo("Blocking post from unauthorized user",
			"user_id", post.UserId,
			"channel_id", post.ChannelId)

		// Return rejection message
		return nil, configuration.BlockMessage
	}

	// User is allowed to post
	return post, ""
}

// MessageWillBeUpdated is invoked when a message is updated by a user before it is committed to the database.
func (p *Plugin) MessageWillBeUpdated(c *plugin.Context, newPost *model.Post, oldPost *model.Post) (*model.Post, string) {
	// Apply the same restrictions to message edits
	return p.MessageWillBePosted(c, newPost)
}

func main() {
	plugin.ClientMain(&Plugin{})
}
