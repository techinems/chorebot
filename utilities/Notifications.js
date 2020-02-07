const {
    app: {
        client: {
            chat: {postMessage}
        }
    }
} = require("./bolt.js");

const fs = require("fs");

require("dotenv").config();

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHORES_CHANNEL = process.env.CHORES_CHANNEL;


class Notifications {
    constructor(chores) {
        this.chores = chores;
        this.phrases = JSON.parse(fs.readFileSync("./phrases.json"));
    }

    async runChores() {
        console.log("Running ChoreBot!");
        const todayschores = await this.chores.getTodaysChores();
        if (todayschores === -1) this.postNoChores();
        else this.postChores(todayschores);
    }

    postChores(chores) {
        this.postSlackMessage("Today's chores have been posted!", [
            this.buildMarkdownSection(this.randomPhrase("greeting")),
            this.buildMarkdownSection("Tonight's chores:"),
            ...chores.map((c, i) => this.buildChoreElement(c, i)),
            this.buildMarkdownSection(this.randomPhrase("request") + " If you have any questions " +
                ":thinking_face: please reach out to the vice president!")
        ]);
    }

    postNoChores() {
        this.postSlackMessage("No chores tonight!", [
            this.buildMarkdownSection(this.randomPhrase("no_chore"))
        ]);
    }

//helper functions

    postSlackMessage(text, blocks) {
        postMessage({
            token: TOKEN,
            channel: CHORES_CHANNEL,
            text, blocks
        });
    }

    buildChoreElement(chore, index) {
        let section = this.buildMarkdownSection(`>${chore}`);
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
    }

    buildMarkdownSection(text) {
        return {
            type: "section",
            text: {
                type: "mrkdwn", text
            }
        };
    }

    randomPhrase(type) {
        const potentialPhrases = this.phrases[type];
        if (type === "request") {
            const currentMonth = (new Date()).getMonth() + 1;
            if (4 <= currentMonth <= 9) {
                potentialPhrases.push("After you go to the Snowman :icecream: or something, make sure that gets done!" +
                    " And then click the \"Done!\" button!");
            }
        }
        return potentialPhrases[Math.floor(Math.random() * potentialPhrases.length)];
    }
}

module.exports = {Notifications};
