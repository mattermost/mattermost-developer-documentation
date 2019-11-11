---
title: "Localizing Matterpoll"
slug: localizing-matterpoll
date: 2019-11-05T10:49:35+02:00
categories:
    - "plugins"
    - "go"
author: Ben Schumacher
github: hanzei
community: hanzei
---

[Matterpoll](https://github.com/matterpoll/matterpoll) is a plugin that allows creating polls inside of Mattermost. Given that Mattermost is [localized in 16 different languages](https://docs.mattermost.com/developer/localization.html) we surely want to accomplish the same for Matterpoll. Because we rely on contributors to do the translations we wanted to make sure it's a easy as possible for them to translate new strings and determine if already translated stings needs to be updated because the "source" text changed. On the other hand Matterpoll only has two maintainer ([@kaaka](https://github.com/kaakaa) and [me](https://github.com/hanzei)) and no own infrastructure to work with. Using some translation server like [Transifex](https://en.wikipedia.org/wiki/Transifex) or [Weblate](https://en.wikipedia.org/wiki/Weblate) is not an option.

The [Mattermost Server](https://github.com/mattermost/mattermost-server) uses the [go-i18n package](https://github.com/nicksnyder/go-i18n). The library is well maintained and very popular, which gave me confidence when using it.


#### Choosing a version

When [Translations where added to Mattermost](https://github.com/mattermost/mattermost-server/commit/8e404c1dcf820cf767e9d6899e8c1efc7bb5ca96#diff-db85c0ea4d2e69c8abaefa875ba77c51) back in 2016 the latest version of go-i18 available was [`v1.4.0`](https://github.com/nicksnyder/go-i18n/releases/tag/v1.4.0). Since then the development has continued and [`v2.0.0`](https://github.com/nicksnyder/go-i18n/releases/tag/v2.0.0) was released may this year. v2 has a completely different API and also the CLI tool [`goi18n`](https://github.com/nicksnyder/go-i18n#command-goi18n-) has changed a lot. Hence, we had to make a choice: Stick with the well established v1 or use the newer v2? 

Let's dive into the difference between the two versions. In v1 translation strings are defined in the translation files, e.g. `en-US.all.json` would contain:
```json
  {
    "id": "settings_title",
    "translation": "Settings"
  }
```
These translations would then be accessible in the Go code with a translation function (`T("settings_title")`). This leads to a loose coupling between the translations string in the translation file and in the code. Often developers forget to add a translation string or misspell the id.

In v2 this was fixed by defining the translations string in the code and automatically extracting it into the translation file. This greatly improves the experience for developers. Also, there are now **two** translation files for every language. For example, German has `active.de.json`, which contains already translated strings, and `translate.de.json`, which contains strings that have to be translated. They either are newly-added strings or strings where the text changed. `goi18n` helps with auto-populating these files.

This change is very handy for both developers and contributors and the main reason we ended up choosing v2 for Matterpoll. Other notable changes are:

- Better support for plural forms with options for e.g. `Zero`, `One`, `Few` and `Many`
- No global state, which helps with running tests in parallel
- Usage of [`golang.org/x/text/language`](https://godoc.org/golang.org/x/text/language) for standardized behavior

For further information please take a look at the [Changelog](https://github.com/nicksnyder/go-i18n/blob/master/CHANGELOG.md#v2) of go-i18n.

Also, it's a good idea to stay up to date with the major version of the libraries that you are using. This way you get the latest bug fixes because open libraries don't backport fixes.

With all this in mind it was not a hard decision for us to go with v2 of go-i18n.


#### Choosing a file format

Go-i18n supports multiple file formats for the translation file. In fact you can use any file format as long as you implement an [unmarshal function](https://godoc.org/github.com/nicksnyder/go-i18n/v2/i18n#UnmarshalFunc) yourself. The most common formats are `JSON`, `TOML` and `YAML`.

Yet again we were faced with a decision: Which format should we use? The Mattermost server uses `JSON`, but is this a reason for us to follow this decision? `goi18n` uses `TOML` by default. We didn't want to dive to deep into [the comparisons between these three](https://gohugohq.com/howto/toml-json-yaml-comparison/) and stuck with `JSON`. In retrospect we might have been better sicking with the default format `TOML` of `goi18n` for consistency with the library default.


### Integrating go-i18n into Matterpoll

With these decisions made we started working on integrating go-i18n into Matterpoll. But first we have to introduce three concepts that go-i18n uses (technically speaking they are just structs):

- [`Bundle`](https://godoc.org/github.com/nicksnyder/go-i18n/v2/i18n#Bundle): A `Bundle` contains the translations
- [`Message`](https://godoc.org/github.com/nicksnyder/go-i18n/v2/i18n#Message): A `Message` is a translation string and can contain plural rules
- [`Localizer`](https://godoc.org/github.com/nicksnyder/go-i18n/v2/i18n#Localizer): A `Localizer` translates `Messages` to a specific language using a `Bundle`

Because Matterpoll needs to fetch the translation files on startup, we need to include them into the plugin bundle. The Makefile of the plugin starter template allows plugin developers to just place their file into `assets` [to get them included in the bundle](https://github.com/mattermost/mattermost-plugin-starter-template#how-do-i-include-assets-in-the-plugin-bundle). 

Since Mattermost v5.10 there is also a [`GetBundlePath()`](https://developers.mattermost.com/extend/plugins/server/reference/#API.GetBundlePath) method of the plugin API, that returns the absolute path where the plugin's bundle was unpacked. This makes accessing assets much easier. The code to load the translation [looks like this](https://github.com/matterpoll/matterpoll/pull/133/files#diff-700816f9b4d51d7404d71e90d2661ddcR15-R45):
```go
// initBundle loads all localization files in i18n into a bundle and return this
func (p *MatterpollPlugin) initBundle() (*i18n.Bundle, error) {
	bundle := &i18n.Bundle{DefaultLanguage: language.English}
	bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

	bundlePath, err := p.API.GetBundlePath()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get bundle path")
	}

	i18nDir := filepath.Join(bundlePath, "assets", "i18n")
	files, err := ioutil.ReadDir(i18nDir)
	if err != nil {
		return nil, errors.Wrap(err, "failed to open i18n directory")
	}

	for _, file := range files {
		if !strings.HasPrefix(file.Name(), "active.") {
			continue
		}

		if file.Name() == "active.en.json" {
			continue
		}
		_, err = bundle.LoadMessageFile(filepath.Join(i18nDir, file.Name()))
		if err != nil {
			return nil, errors.Wrapf(err, "failed to load message file %s", file.Name())
		}
	}

	return bundle, nil
}
```

The bundle returned is stored inside the `MatterpollPlugin` struct. We call `initBundle` once in [`OnActivate`](https://developers.mattermost.com/extend/plugins/server/reference/#Hooks.OnActivate).

A `Localizer` is ephemeral and needs to be created every time a user interacts with the plugin, e.g. when creating a poll via `/poll` or voting by pressing an [Interactive Message Button](https://docs.mattermost.com/developer/interactive-messages.html). In order to create a `Localizer` we need to fetch the user's `Locale` setting. Luckily, it's part of the [`User`](https://godoc.org/github.com/mattermost/mattermost-server/model#User) struct. We wrote a short helper function to create a `Localizer` for a specific user:

```go
// getUserLocalizer returns a localizer that localizes in the users locale
func (p *MatterpollPlugin) getUserLocalizer(userID string) *i18n.Localizer {
	user, err := p.API.GetUser(userID)
	if err != nil {
		p.API.LogWarn("Failed get user's locale", "error", err.Error())
		return p.getServerLocalizer()
	}

	return i18n.NewLocalizer(p.bundle, user.Locale)
}
```

No every part of Matterpoll is localizable on a user level. Take polls for example.

{{< figure src="poll-1.png" alt="Poll 1">}}

While the response when clicking an option should be localized with the user's local, the "Total Votes" text can not. Posts are shown in the same way for every user, hence we have to use the same localization for every user. Admins can configure a [Default Client Language](https://docs.mattermost.com/administration/config-settings.html#default-client-language) in the System Console that is used for newly-created users and pages where the user hasn’t logged in. We decided to use this local for translating these kind of strings and build a helper for this:

```go
// getServerLocalizer returns a localizer that localizes in the server default client locale
func (p *MatterpollPlugin) getServerLocalizer() *i18n.Localizer {
	return i18n.NewLocalizer(p.bundle, *p.ServerConfig.LocalizationSettings.DefaultClientLocale)
}
```

With this preparation we were finally ready to do the actual task: Defining and translating actual strings. Putting the pieces together is quite simple and comes down to:

```go
	l := p.getUserLocalizer(userID)
	response, err := l.LocalizeMessage(&i18n.Message{
		ID:    "response.vote.counted",
		Other: "Your vote has been counted.",
	}
	
	// Send response back
```

Most translation strings can be translated without any context information. But for example the "Total Votes" text you saw above include the number of votes. We did incorporate this information directly into the `Message`:

```go
	l := p.getUserLocalizer(userID)
	response, err := l.Localize(&i18n.LocalizeConfig{
		DefaultMessage: &i18n.Message{
			ID:    "poll.message.totalVotes",
			Other: "**Total votes**: {{.TotalVotes}}",
		},
		TemplateData:   map[string]interface{}{"TotalVotes": numberOfVotes},
	})
		
	// Send response back
```

### Extracting the translation strings

As already mentioned [`goi18n`](https://github.com/nicksnyder/go-i18n#command-goi18n-) allow the extraction of translation string from the code into the translation file. This can be done by running
`goi18n extract -format json -outdir assets/i18n/ server/`, which creates `assets/i18n/active.en.json` containing all translation strings.

#### Adding a new language

If, for example, we want to add support for German, which has the language code `de`, we have to:

1. Create its own file: `touch assets/i18n/translate.de.json`
- Merge all translation strings into the new file: `goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.en.json assets/i18n/translate.de.json`
- Translate all strings in `translate.de.json`
- Rename it from `translate.de.json` to `active.de.json`

#### Translating new strings

1. Extract the new goi18n translations strings: `goi18n extract -format json -outdir assets/i18n/ server/`
- Update your translation file: `goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json`
- Translate all strings for a language e.g. in `active.de.json`
- Merge the translations in the active files: `goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json assets/i18n/translate.de.json`

### Future Ideas

This is a rough outline how plugins can use the existing framework to fully support localization. If other plugin developers adapt this approach, it might get officially supported by Mattermost. This means that the plugin framework would support translations via go-i18n.

- As you can see using `goi18n` is a bit cumbersome. To make translating easier some commands could be encapsulated in make target in the [starter-template](https://github.com/mattermost/mattermost-plugin-starter-template/blob/master/Makefile).
- The helper methods like `initBundle`, `getUserLocalizer` and `getServerLocalizer` could become a [plugin helper](https://developers.mattermost.com/extend/plugins/helpers/).

I would love to hear feedback about the approach we took. Feel free to share it on the [Toolkit channel](https://community.mattermost.com/core/channels/developer-toolkit) on the Mattermost community server.
