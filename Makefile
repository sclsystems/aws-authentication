cli-authenticate:
	@docker-compose run \
		--rm \
		-e GOOGLE_IDP_ID=$(GOOGLE_IDP_ID) \
		-e GOOGLE_SP_ID=$(GOOGLE_SP_ID) \
		-e DURATION=3600 \
		-e AWS_DEFAULT_REGION=ap-southeast-2 \
		-e AWS_PROFILE=default \
		aws-auth-cli -a
