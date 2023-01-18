# Mattermost developer documentation [![Mattermost dev docs status badge](https://circleci.com/gh/mattermost/mattermost-developer-documentation.svg?style=svg)](https://circleci.com/gh/mattermost/mattermost-developer-documentation/tree/master)

Website for Mattermost developer documentation, built using [Hugo](https://gohugo.io/). The `master` branch is continuously deployed to [developers.mattermost.com](https://developers.mattermost.com/).

## Contribute

### Prerequisites

- Golang v1.18+ [(_download_)](https://go.dev/dl)
- NodeJS v14+ [(_download_)](https://nodejs.org/en/download/)
- cURL [(_download_)](https://curl.se/download.html)
  - (_optional_) Used to update Compass Icons

### Set up your environment

1. Follow the [Hugo documentation](https://gohugo.io/getting-started/installing/) to install Hugo. This repo uses Hugo v0.101.0 to build the docs.

    ```shell
    # For example, on macOS:
    brew install hugo
    
    # Snapcraft on Linux:
    snap install hugo
   
    # or using golang directly:
    go install github.com/gohugoio/hugo@v0.101.0
    ```

2. Fork the repository and clone the fork to your machine. Change directories to the cloned repo when it has finished.

    ```shell
    git clone git@github.com:<yourgithubname>/mattermost-developer-documentation.git
    cd mattermost-developer-documentation
    ```

3. Generate JSON plugin docs; this must be done at least once.

    ```shell
    make plugin-data
    ```

4. Start the Hugo development server.

    ```shell
    make run
    ```

5. Open [http://localhost:1313](http://localhost:1313) in a new browser tab to see the docs

You're all set! You can start making changes as desired; the development server will automatically re-render affected docs pages.

**Note:** Before pushing changes to your fork, run a full build of the docs using `make dist` to make sure there are no build errors. 

## Best practices

- The Mattermost developer documentation uses several custom Hugo [shortcodes](https://gohugo.io/content-management/shortcodes/) to control its presentation. Shortcodes are preferred over using raw HTML and should be used where possible.
- Links that navigate away from `developers.mattermost.com` should use the [newtabref shortcode](#open-links-in-a-new-tab).

### Hugo shortcodes

#### Collapse

The `collapse` shortcode creates a collapsible text box.

```gotemplate
{{<collapse id="client_bindings_request" title="Client requests bindings from server">}}
`GET /plugins/com.mattermost.apps/api/v1/bindings?user_id=ws4o4macctyn5ko8uhkkxmgfur&channel_id=qphz13bzbf8c7j778tdnaw3huc&scope=webapp`
{{</collapse>}}
```

![Example of collapse shortcode](readme_assets/shortcode-collapse.png)

Note that the `id` attribute of the shortcode must be unique on the page.

#### Compass icon

The `compass-icon` shortcode displays an icon from the [Compass Icon](https://mattermost.github.io/compass-icons/) set. The shortcode takes 2 arguments: the ID of the icon and an optional icon description which is used as alt text.

```gotemplate
{{<compass-icon icon-star "Mandatory Value">}}
```

![Example of compass-icon shortcode](readme_assets/shortcode-compass-icon.png)

#### Mermaid

The `mermaid` shortcode allows embedding [Mermaid](https://mermaid-js.github.io/mermaid/#/) diagram syntax into the page.
Each page that uses a Mermaid diagram must also have a `mermaid: true` property set in the page's frontmatter.

```gotemplate
{{<mermaid>}}
sequenceDiagram
    actor System Admin
    System Admin->>Mattermost server: install app
    Mattermost server->>Apps framework: install app
    Apps framework->>App: request manifest
    App->>Apps framework: send manifest
    Apps framework->>System Admin: request permissions
    System Admin->>Apps framework: grant permissions
    Apps framework->>Mattermost server: create bot
    Apps framework->>Mattermost server: create OAuth app
    Apps framework->>Apps framework: enable app
    Apps framework->>App: call OnInstall if defined
{{</mermaid>}}
```

![Example of Mermaid shortcode](readme_assets/shortcode-mermaid.png)

#### Open links in a new tab

The `newtabref` shortcode creates a link that opens in a new browser tab. The link text is followed by a Compass Icon which indicates the link will open in a new tab.

```gotemplate
All Apps should define a manifest ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest">}}) as a JSON object.
```

![Example of newtabref shortcode](readme_assets/shortcode-newtabref.png)

#### Note

The `note` shortcode displays a styled message box suitable for a note. The shortcode accepts 3 arguments: the title of the node, an optional Compass Icon ID, and an optional description for the Compass Icon.

```gotemplate
{{<note "Mandatory values" "icon-star" "Mandatory Value">}} 
- The `app_id` and `homepage_url` values must be specified.
- At least one deployment method - `aws_lambda`, `open_faas`, or `http` - must be specified.
{{</note>}}
```

![Example of note shortcode](readme_assets/shortcode-note.png)
