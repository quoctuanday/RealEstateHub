const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

const auth = new GoogleAuth({
    keyFile: path.join(__dirname, '../realestate.json'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

async function sendToDialogflow(message) {
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const projectId = 'realestate-se9e';
    const sessionId = 'user-session-id';
    const languageCode = 'vi';

    const response = await axios.post(
        `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`,
        {
            queryInput: {
                text: {
                    text: message,
                    languageCode,
                },
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        }
    );

    const reply =
        response.data.queryResult?.fulfillmentText || 'Tôi không biết';
    return reply;
}

module.exports = { sendToDialogflow };
