# Session Heads Up
CURRENT_DATE_SECONDS=$(shell date +%s)
HOUR_IN_SECONDS=3600
HOUR_LATER=$$(( $(CURRENT_DATE_SECONDS) + $(HOUR_IN_SECONDS) ))

cli-authenticate:
	@docker-compose run \
		--rm \
		-e GOOGLE_IDP_ID=$(GOOGLE_IDP_ID) \
		-e GOOGLE_SP_ID=$(GOOGLE_SP_ID) \
		-e DURATION=3600 \
		-e AWS_DEFAULT_REGION=ap-southeast-2 \
		-e AWS_PROFILE=default \
		aws-auth-cli -a && ([ $$? -eq 0 ] && echo AWS_SESSION_TOKEN_EXPIRY=$(shell echo $(HOUR_LATER)) > $(HOME)/.aws_session_expiry)
