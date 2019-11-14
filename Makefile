# Session Heads Up
CURRENT_DATE_SECONDS=$(shell date +%s)
TIMEOUT_IN_SECONDS=43200
HOUR_LATER=$$(( $(CURRENT_DATE_SECONDS) + $(TIMEOUT_IN_SECONDS) ))

cli-authenticate:
	@docker-compose run \
		--rm \
		-e GOOGLE_IDP_ID=$(GOOGLE_IDP_ID) \
		-e GOOGLE_SP_ID=$(GOOGLE_SP_ID) \
		-e DURATION=$(TIMEOUT_IN_SECONDS) \
		-e AWS_DEFAULT_REGION=ap-southeast-2 \
		-e AWS_PROFILE=default \
		aws-auth-cli -a && ([ $$? -eq 0 ] && echo AWS_SESSION_TOKEN_EXPIRY=$(shell echo $(HOUR_LATER)) > $(HOME)/.aws_session_expiry)
.PHONY: cli-authenticate

cli-deny:
	@echo '' > $(HOME)/.aws/credentials
	@echo '' > $(HOME)/.aws_session_expiry
.PHONY: cli-deny
