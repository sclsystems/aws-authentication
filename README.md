# AWS Auth

## Get CLI Temporary Credentials

1. Set the Below Environment Variables and export them in your `.zshrc`
```bash
export AWS_AUTH_DIRECTORY=/path/to/AWS-Auth
export GOOGLE_IDP_ID=abcde12345
export GOOGLE_SP_ID=abcde12345
```

2. Add the `bin` to your path and sources
```bash
export PATH=$PATH:$AWS_AUTH_DIRECTORY/bin
source $AWS_AUTH_DIRECTORY/bin/session-check
```

3. Run `aws-auth`

## Google Suite SAML

#### G Suite SAML App Addition

1. Create a new SAML App For AWS [here](https://admin.google.com/AdminHome?hl=en_GB#AppsList:serviceType=SAML_APPS)
1. Follow [this guide](https://support.google.com/a/answer/6194963)
1. For Step 6 in the guide above, follow the `User SAML Management` below

#### User SAML Management

1. Create a `New Project` in the [Google API Console](https://console.developers.google.com/projectcreate)
1. Enable the [Admin SDK](https://console.developers.google.com/apis/library/admin.googleapis.com)
1. Create [credentials](https://console.developers.google.com/apis/credentials/wizard)
    1. Which API are you using? - Admin SDK
    1. Where will you be calling the API from? - Web Server
    1. What data will you be accessing? - User Data
    1. Create an OAuth 2.0 client ID
        1. Authorised JavaScript origins: http://localhost:8080
        1. Authorised redirect URIs: http://localhost:8080
    1. Download the credentials

## References

https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_saml.html

https://github.com/cevoaustralia/aws-google-auth
