.PHONY: dist plugin-data

dist: plugin-data
	rm -rf ./dist
	cd site && hugo --destination ../dist/html

plugin-data:
	go get -u -v github.com/mattermost/mattermost-server/plugin
	mkdir -p site/data
	go run scripts/plugin-godocs.go > site/data/PluginGoDocs.json
	go run scripts/plugin-manifest-docs.go > site/data/PluginManifestDocs.json
