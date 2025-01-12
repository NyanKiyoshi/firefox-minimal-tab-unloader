build:
	mkdir -p dist
	rm dist/*
	zip --quiet -r -FS dist/build.zip ./manifest.json background.js icons/

