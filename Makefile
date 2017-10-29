.PHONY: dist

dist:
	rm -rf ./dist
	cd site && hugo --destination ../dist/html
