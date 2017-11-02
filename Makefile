.PHONY: dist plugin-godocs

dist: plugin-godocs
	rm -rf ./dist
	cd site && hugo --destination ../dist/html

plugin-godocs:
	go get -u -v github.com/mattermost/mattermost-server/plugin
	mkdir -p site/data
	go run scripts/plugin-godocs.go > site/data/PluginGoDocs.json
