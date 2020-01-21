.PHONY: dist plugin-data backend-plugin-data frontend-plugin-data

dist: plugin-data
	rm -rf ./dist
	cd site && ./hugow --destination ../dist/html

plugin-data: backend-plugin-data frontend-plugin-data devtalks-data

backend-plugin-data:
	mkdir -p site/data
	go run ./cmd/plugin-godocs > site/data/PluginGoDocs.json
	go run ./cmd/plugin-manifest-docs > site/data/PluginManifestDocs.json

frontend-plugin-data:
	rm -rf scripts/mattermost-webapp
	cd scripts && git clone https://github.com/mattermost/mattermost-webapp.git
	cd scripts && npm install
	mkdir -p site/data
	node scripts/plugin-jsdocs.js > site/data/PluginJSDocs.json

devtalks-data:
	mkdir -p site/data
ifdef YOUTUBE_API_KEY
	go run ./cmd/devtalks > site/data/DevTalks.json
endif

dev:
	cd site && ./hugow server -D
