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
        prompt: oAuthConstants.promptType,
        scope: oAuthConstants.scopes,
    });

    console.log(userInfoConstants.authorise({ authUrl }));

    const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        read.question(userInfoConstants.codeInput, (code) => {
            read.close();
            oauth2Client.getToken(code, async (error, token) => {
                if (error) {
                    return reject(errorsConstants.tokenRetrieval({ error }));
                }

                try {
                    await fs.writeFile(tokenFile, JSON.stringify(token));
                    return resolve();
                } catch (error) {
                    return reject(errorsConstants.writingError({ fileName: tokenFile }));
                }
            });
        });
    });
};

const listUsers = async () => {
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

    return new Promise((resolve, reject) => {
        service.users.list({
            customer: 'my_customer',
            maxResults: 10,
            orderBy: 'email',
        }, (err, res) => {
            if (err) {
                return reject('The API returned an error:', err.message);
            }

            const users = res.data.users;
            if (users.length) {
                console.log('Users:');
                users.forEach((user) => {
                    console.log(`${user.primaryEmail} (${user.name.fullName})`);
                });
            } else {
                return resolve('No users found.');
            }

            return resolve();
        });
    });
};

(async () => {
    try {
        await authenticate();
        await listUsers();
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
})();
