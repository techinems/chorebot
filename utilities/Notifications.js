const {
    app: {
        client: {
            chat: {postMessage}
        }
    }
} = require("./bolt.js");

const fs = require("fs");

require("dotenv").config();

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHORES_CHANNEL = process.env.CHORES_CHANNEL;
const PHRASES = JSON.parse(fs.readFileSync("./phrases.json"));


class Notifications {

    static async runNotification() {
        console.log("Running ChoreBot!");
        const todayschores = await Notifications.chores.getTodaysChores();
        if (todayschores === -1) Notifications.postNoChores();
        else Notifications.postChores(todayschores);
    }

    static postChores(chores) {
        Notifications.postSlackMessage("Today's chores have been posted!", [
            Notifications.buildMarkdownSection(Notifications.randomPhrase("greeting")),
            Notifications.buildMarkdownSection("Tonight's chores:"),
            ...chores.map((c, i) => Notifications.buildChoreElement(c, i)),
            Notifications.buildMarkdownSection(Notifications.randomPhrase("request") + " If you have any questions " +
                ":thinking_face: please reach out to the vice president!")
        ]);
    }

    static postNoChores() {
        Notifications.postSlackMessage("No chores tonight!", [
            Notifications.buildMarkdownSection(Notifications.randomPhrase("no_chore"))
        ]);
    }

//helper functions

    static postSlackMessage(text, blocks) {
        postMessage({
            token: TOKEN,
            channel: CHORES_CHANNEL,
            text, blocks
        });
    }

    static buildChoreElement(chore, index) {
        let section = Notifications.buildMarkdownSection(`>${chore}`);
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

    static buildMarkdownSection(text) {
        return {
            type: "section",
            text: {
                type: "mrkdwn", text
            }
        };
    }

    static randomPhrase(type) {
        const potentialPhrases = PHRASES[type];
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
