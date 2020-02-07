const {
    app: {
        client: {
            chat: {postMessage}
        }
    }
} = require("./bolt.js");

const fs = require("fs");

const {getTodaysChores} = require("./Chores");

require("dotenv").config();

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHORES_CHANNEL = process.env.CHORES_CHANNEL;

const phrases = JSON.parse(fs.readFileSync("./phrases.json"));

const runChores = async () => {
        console.log("Running ChoreBot!");
    const todayschores = await getTodaysChores();
    if (todayschores === -1) postNoChores();
    else (postChores(todayschores));
};

const postChores = chores => {
    postSlackMessage("Today's chores have been posted!", [
        buildMarkdownSection(randomPhrase("greeting")),
        buildMarkdownSection("Tonight's chores:"),
        ...chores.map((c, i) => buildChoreElement(c, i)),
        buildMarkdownSection(randomPhrase("request") + " If you have any questions " +
                ":thinking_face: please reach out to the vice president!")
        ]);
};

const postNoChores = () => postSlackMessage("No chores tonight!", [
    buildMarkdownSection(randomPhrase("no_chore"))
]);

//helper functions

const postSlackMessage = (text, blocks) => {
    postMessage({
        token: TOKEN,
        channel: CHORES_CHANNEL,
        text, blocks
    });
};

const buildChoreElement = (chore, index) => {
    let section = buildMarkdownSection(`>${chore}`);
        section.accessory = {
            type: "button",
            text: {
                type: "plain_text",
                text: "Done!",
                emoji: true
            },
            action_id: `${index}`
        };
        return section;
};
const buildMarkdownSection = text => {
        return {
            type: "section",
            text: {
                type: "mrkdwn", text
            }
        };
};

const randomPhrase = type => {
    const potentialPhrases = phrases[type];
        if (type === "request") {
            const currentMonth = (new Date()).getMonth() + 1;
            if (4 <= currentMonth <= 9) {
                potentialPhrases.push("After you go to the Snowman :icecream: or something, make sure that gets done!" +
                    " And then click the \"Done!\" button!");
            }
        }
        return potentialPhrases[Math.floor(Math.random() * potentialPhrases.length)];
};

module.exports = {runChores};
