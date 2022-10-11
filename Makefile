.PHONY: dist
dist: plugin-data
	rm -rf ./dist
	hugo -s site --destination ../dist/html

.PHONY: plugin-data
plugin-data: backend-plugin-data frontend-plugin-data

.PHONY: backend-plugin-data
backend-plugin-data:
	mkdir -p site/data
	go run ./cmd/plugin-godocs > site/data/PluginGoDocs.json
	go run ./cmd/plugin-manifest-docs > site/data/PluginManifestDocs.json

.PHONY: frontend-plugin-data
frontend-plugin-data:
	rm -rf scripts/mattermost-webapp || true
	cd scripts && npm install
	mkdir -p site/data
	node scripts/plugin-jsdocs.js > site/data/PluginJSDocs.json

.PHONY: run
run:
	hugo server --buildDrafts --disableFastRender -F -s site

.PHONY: build
build:
	rm -rf ./dist
	hugo -s site --verbose --destination ../dist/html --printUnusedTemplates --printPathWarnings --gc

.PHONY: test
test:
	docker run -v $(PWD)/dist/html/:/mnt 18fgsa/html-proofer mnt --ignore_empty_alt