const errors = {
    missingCredentials: ({ credentialName }) => `Missing credential '${credentialName}'`,
    tokenRetrieval: ({ error }) => `Error retrieving access token, ${error}`,
    writingError: ({ fileName }) => `Could not write to file ${fileName}`,
    readingError: ({ fileName }) => `Could not read file ${fileName}`,
};

const userInfo = {
    authorise: ({ authUrl }) => `Authorize this app by visiting this url: ${authUrl}`,
    codeInput: 'Enter the code from that page here: ',
};

const oAuth = {
    scopes: [
        'https://www.googleapis.com/auth/admin.directory.user'
    ],
    accessType: 'offline',
    promptType: 'consent',
    version: 'directory_v1',
};

module.exports = {
    errors,
    oAuth,
    userInfo,
};
