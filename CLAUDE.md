# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Mattermost developer documentation website built with Hugo (static site generator). The documentation is continuously deployed from the `master` branch to [developers.mattermost.com](https://developers.mattermost.com/).

## Prerequisites

- Golang v1.19+ (required for plugin documentation generation)
- NodeJS v14+ (required for JavaScript plugin docs and HTML validation)
- Hugo v0.101.0 (static site generator)
- cURL (optional, for updating Compass Icons)

## Common Development Commands

### Initial Setup
```bash
# Generate plugin documentation (required on first run)
make plugin-data

# Start development server
make run
# Opens at http://localhost:1313
```

### Build Commands
```bash
# Development build
make build

# Production build (includes plugin data generation)
make dist

# Test HTML output
make test
# Equivalent to: npm install && npm run test-html
```

### Plugin Documentation Generation
```bash
# Generate all plugin data
make plugin-data

# Generate backend plugin docs only
make backend-plugin-data

# Generate frontend plugin docs only  
make frontend-plugin-data
```

### Other Commands
```bash
# Update Compass Icons from CDN
make compass-icons
```

## Architecture & Key Components

### Repository Structure
- `site/` - Hugo site source files
  - `content/` - Markdown documentation content
  - `layouts/` - Hugo HTML templates and partials
  - `static/` - Static assets (CSS, JS, images)
  - `config.toml` - Hugo configuration
- `cmd/` - Go tools for generating plugin documentation
- `scripts/` - Node.js tools for JavaScript plugin docs
- `dist/` - Generated site output (created by builds)

### Hugo Site Configuration
- Base URL: `https://developers.mattermost.com/`
- Hugo version: v0.101.0
- Uses custom shortcodes for enhanced content presentation
- Supports Mermaid diagrams, collapsible content, tabbed sections

### Plugin Documentation System
The site includes auto-generated documentation for Mattermost plugins:

**Backend Plugin Docs** (`cmd/plugin-godocs/`):
- Parses Go source code from `github.com/mattermost/mattermost/server/public/plugin`
- Generates JSON documentation for API, Hooks, and Helper interfaces
- Extracts method signatures, parameters, and documentation comments
- Outputs to `site/data/PluginGoDocs.json`

**Frontend Plugin Docs** (`scripts/plugin-jsdocs.js`):
- Fetches plugin registry from mattermost webapp
- Parses TypeScript/JavaScript using `@typescript-eslint/typescript-estree`
- Extracts method names, parameters, and comments
- Outputs to `site/data/PluginJSDocs.json`

### Custom Hugo Shortcodes
The documentation uses several custom shortcodes:
- `{{<collapse>}}` - Collapsible content sections
- `{{<compass-icon>}}` - Mattermost Compass icon display
- `{{<mermaid>}}` - Mermaid diagram rendering
- `{{<newtabref>}}` - External links that open in new tabs
- `{{<note>}}` - Styled notification boxes
- `{{<tabs>}}` and `{{<tab>}}` - Tabbed content sections

### Content Organization
- `contribute/` - Open source contribution guides
- `integrate/` - Integration documentation (webhooks, plugins, APIs)
- `blog/` - Developer blog posts
- `internal/` - Internal Mattermost documentation (draft status)

## Development Workflow

1. Make content changes in `site/content/`
2. Run `make run` for live development server
3. Test with `make dist` before pushing to ensure no build errors
4. The `master` branch auto-deploys to production

## Important Notes

- Plugin documentation is auto-generated from external sources
- Always run `make plugin-data` at least once before development
- Use custom shortcodes instead of raw HTML where possible
- External links should use the `newtabref` shortcode
- Mermaid diagrams require `mermaid: true` in page frontmatter