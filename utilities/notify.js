//local packages
const {
  app: {
    client: {
      chat: { postMessage }
    }
  }
} = require("./bolt.js");
const { randomPhrase } = require("./randomPhrases.js");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHORES_CHANNEL = process.env.CHORES_CHANNEL;

const buildMarkdownSection = text => ({
  type: "section",
  text: { type: "mrkdwn", text }
});

//helper functions
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

const postSlackMessage = (text, blocks) => postMessage({
  token: TOKEN,
  channel: CHORES_CHANNEL,
  text, blocks
});

// const notifyOfficers = () => {
//   console.log("Notifying officers!");
// };
// TODO: build function to notify officers there aren't any chores

const sendNoChores = () => postSlackMessage("No chores tonight!", [
  buildMarkdownSection(randomPhrase("no_chore"))
]);

const postToSlack = chores => postSlackMessage("Today's chores have been posted!", [
  buildMarkdownSection(randomPhrase("greeting")),
  buildMarkdownSection("Tonight's chores:"),
  ...chores.map((c, i) => buildChoreElement(c, i)),
  buildMarkdownSection(randomPhrase("request") + " If you have any questions " + 
    ":thinking_face: please reach out to the vice president!")
]);

module.exports = { sendNoChores, postToSlack };
