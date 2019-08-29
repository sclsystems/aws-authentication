const { errors: errorsConstants } = require('./constants');

const getCredentials = () => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, GOOGLE_TOKEN_PATH } = process.env;

    const credentials = {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        tokenPath: GOOGLE_TOKEN_PATH,
        redirectUri: REDIRECT_URI,
    };

    Object.keys(credentials).forEach(credential => {
        if (!credentials[credential]) {
            throw new Error(errorsConstants.missingCredentials({ credentialName: credential }));
        }
    });

    return credentials;
};

const getTokenPath = () => {
    const { GOOGLE_TOKEN_PATH } = process.env;

    if (!GOOGLE_TOKEN_PATH) {
        throw new Error(errorsConstants.missingCredentials({ credentialName: 'GOOGLE_TOKEN_PATH' }));
    }

    return GOOGLE_TOKEN_PATH;
};

module.exports = {
    getCredentials,
    getTokenPath,
};
