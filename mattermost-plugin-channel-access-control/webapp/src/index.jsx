import React from 'react';
import ChannelRulesSettings from './components/channel_rules_settings';

class Plugin {
    initialize(registry, store) {
        // Register custom settings component for advanced channel rules management
        registry.registerAdminConsoleCustomSetting(
            'ChannelRules',
            ChannelRulesSettings,
            {showTitle: true}
        );
    }

    uninitialize() {
        // No cleanup required
    }
}

window.registerPlugin('com.mattermost.channel-access-control', new Plugin());
