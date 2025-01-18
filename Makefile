.PHONY: build

build:
	mkdir -p dist
	zip --quiet -r -FS dist/build.zip ./manifest.json background.js icons/

