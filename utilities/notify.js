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

//helper functions
const buildChoreElement = (chore, index) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `>${chore}`
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Done!",
        emoji: true
      },
      action_id: `${index}`
    }
  };
};

// const notifyOfficers = () => {
//   console.log("Notifying officers!");
// };
// TODO: build function to notify officers there aren't any chores

const sendNoChores = () => {
  postMessage({
    token: TOKEN,
    channel: CHORES_CHANNEL,
    text: "No chores tonight!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: randomPhrase("no_chore")
        }
      }
    ]
  });
};

const postToSlack = chores => {
  postMessage({
    token: TOKEN,
    channel: CHORES_CHANNEL,
    text: "Today's chore has been posted!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: randomPhrase("greeting")
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Tonight's chores:"
        }
      },
      ...chores.map((c, i) => buildChoreElement(c, i)),
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            randomPhrase("request") +
            " If you have any questions :thinking_face: please reach out to the vice president!"
        }
      }
    ]
  });
};

module.exports = { sendNoChores, postToSlack };
