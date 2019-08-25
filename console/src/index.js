const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
const utils = require('./utils');
const { oAuth: oAuthConstants, userInfo: userInfoConstants, errors: errorsConstants } = require('./constants');

const authenticate = async () => {
    const credentials = utils.getCredentials();
    const tokenFile = utils.getTokenPath();

    const oauth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri,
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: oAuthConstants.accessType,
        scope: oAuthConstants.scopes,
    });

    console.log(userInfoConstants.authorise({ authUrl }));

    const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    read.question(userInfoConstants.codeInput, (code) => {
        read.close();
        oauth2Client.getToken(code, async (error, token) => {
            if (error) {
                return console.error(errorsConstants.tokenRetrieval);
            }

            try {
                await fs.writeFile(tokenFile, JSON.stringify(token));
                return true;
            } catch (error) {
                console.log(errorsConstants.writingError({ fileName: tokenFile }));
                return false;
            }
        });
    });
};

const listUsers = async (auth) => {
    const credentials = utils.getCredentials();
    const tokenFile = utils.getTokenPath();

    const oauth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri,
    );

    try {
        const tokenData = await fs.readFile(tokenFile);
        oauth2Client.credentials = JSON.parse(tokenData.toString());
    } catch (error) {
        console.log(errorsConstants.readingError({ fileName: tokenFile }));
        return false;
    }

    const service = google.admin({ version: oAuthConstants.version, auth: oauth2Client });
    service.users.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email',
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err.message);

        const users = res.data.users;
        if (users.length) {
            console.log('Users:');
            users.forEach((user) => {
                console.log(`${user.primaryEmail} (${user.name.fullName})`);
            });
        } else {
            console.log('No users found.');
        }

        return true;
    });
};

(async () => {
    await authenticate();
    await listUsers();
})();
