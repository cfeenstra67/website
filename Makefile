
build-lambda:
	mkdir -p build
	zip build/lambda.zip lambda_handler.py


build-images:
	venv/bin/python generate_images.py

build-site:
	npm run build

build: build-lambda build-images build-site

fmt:
	black lambda_handler.py generate_images.py infra
