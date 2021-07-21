.PHONY: dist
dist: plugin-data
	rm -rf ./dist
	hugo -s site --destination ../dist/html

.PHONY: plugin-data
plugin-data: backend-plugin-data frontend-plugin-data devtalks-data

.PHONY: backend-plugin-data
backend-plugin-data:
	mkdir -p site/data
	go run ./cmd/plugin-godocs > site/data/PluginGoDocs.json
	go run ./cmd/plugin-manifest-docs > site/data/PluginManifestDocs.json

.PHONY: frontend-plugin-data
frontend-plugin-data:
	rm -rf scripts/mattermost-webapp
	cd scripts && git clone https://github.com/mattermost/mattermost-webapp.git
	cd scripts && npm install
	mkdir -p site/data
	node scripts/plugin-jsdocs.js > site/data/PluginJSDocs.json

.PHONY: frontend-plugin-data
devtalks-data:
	mkdir -p site/data
ifdef YOUTUBE_API_KEY
	go run ./cmd/devtalks > site/data/DevTalks.json
endif

.PHONY: run
run:
	hugo server --buildDrafts --disableFastRender -F -s site
