/* ***************************************************
 * Slack Bot: A Bot for slack to communicate with GPT
 *
 * Aviv Levy (@aviv-levy)
 * ***************************************************/

require('dotenv').config();

const { OpenAI } = require("openai");
const express = require('express');
const Slack = require("@slack/bolt");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const openai = new OpenAI({ apiKey: process.env.GPT_TEST_API_KEY });
const slack = new Slack.App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});

const server = app.listen(process.env.PORT || 5000, () => {

    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


app.get('/test', async (req, res) => {
    try {
        slack.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_CHANNEL,
            text: "This is a test."
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
})


 /* *******************************
 /* Sends api request to ChatGpt
 /* Respones the answer to Slack 
 /* ***************************** */
app.get('/gpt', async (req, res) => {//Need to be changed to post and pass content of the question to chatGpt

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'What is the result of 4+4' }],
            model: 'gpt-4'
        })
        res.send(completion.choices[0].message.content);

    } catch (err) {
        res.status(500).send(err.message);
    }

});


