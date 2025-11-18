# Makefile for Mattermost Channel Access Control Plugin

PLUGIN_ID = com.mattermost.channel-access-control
PLUGIN_VERSION = 1.0.0

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get

# Build targets
.PHONY: all build clean dist package

all: clean build package

## Build the plugin
build: build-server build-webapp

## Build server executables
build-server:
	@echo "Building server..."
	mkdir -p server/dist
	cd server && $(GOBUILD) -o dist/plugin-linux-amd64 -v .
	cd server && GOOS=darwin GOARCH=amd64 $(GOBUILD) -o dist/plugin-darwin-amd64 -v .
	cd server && GOOS=windows GOARCH=amd64 $(GOBUILD) -o dist/plugin-windows-amd64.exe -v .
	@echo "Server build complete"

## Build webapp bundle
build-webapp:
	@echo "Building webapp..."
	mkdir -p webapp/dist
	cd webapp && npm install
	cd webapp && npm run build
	@echo "Webapp build complete"

## Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf server/dist
	rm -rf webapp/dist
	rm -rf dist
	@echo "Clean complete"

## Create dist directory
dist:
	@echo "Creating dist directory..."
	mkdir -p dist/$(PLUGIN_ID)
	cp plugin.json dist/$(PLUGIN_ID)/
	mkdir -p dist/$(PLUGIN_ID)/server/dist
	cp -r server/dist/* dist/$(PLUGIN_ID)/server/dist/
	mkdir -p dist/$(PLUGIN_ID)/webapp/dist
	cp webapp/dist/main.js dist/$(PLUGIN_ID)/webapp/dist/
	@echo "Dist directory created"

## Package the plugin
package: dist
	@echo "Packaging plugin..."
	cd dist && tar -czf $(PLUGIN_ID)-$(PLUGIN_VERSION).tar.gz $(PLUGIN_ID)
	@echo "Plugin packaged: dist/$(PLUGIN_ID)-$(PLUGIN_VERSION).tar.gz"

## Deploy the plugin to your Mattermost instance
deploy: package
	@echo "Deploying plugin..."
	@if [ -z "$(MM_SERVICESETTINGS_SITEURL)" ]; then \
		echo "Error: MM_SERVICESETTINGS_SITEURL is not set"; \
		exit 1; \
	fi
	@if [ -z "$(MM_ADMIN_TOKEN)" ] && [ -z "$(MM_ADMIN_USERNAME)" ]; then \
		echo "Error: Either MM_ADMIN_TOKEN or MM_ADMIN_USERNAME must be set"; \
		exit 1; \
	fi
	@echo "Deploying to $(MM_SERVICESETTINGS_SITEURL)..."
	# Deployment command would go here

## Run tests
test:
	@echo "Running tests..."
	cd server && $(GOTEST) -v ./...
	@echo "Tests complete"
