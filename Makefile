
build-lambda:
	mkdir -p build
	zip build/lambda.zip lambda_handler.py


build-images:
	@mkdir -p public/images/generated
	venv/bin/python generate_images.py

obsidian-export:
	@rm -rf obsidian-tmp
	@mkdir obsidian-tmp
	obsidian-export \
		/Users/cam/Library/Mobile\ Documents/iCloud\~md\~obsidian/Documents/CLF/ \
		obsidian-tmp \
		--start-at=/Users/cam/Library/Mobile\ Documents/iCloud\~md\~obsidian/Documents/CLF/Website
	@rm -rf content public/images
	@mv obsidian-tmp/images public/images
	@mv obsidian-tmp content


build-site:
	npm run build

build: build-lambda build-images build-site

fmt:
	venv/bin/black lambda_handler.py generate_images.py infra
