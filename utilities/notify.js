//local packages
const {
  app: {
    client: {
      chat: { postMessage }
    }
  }
} = require("./bolt.js");

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
      value: `chore_done_${index}`
    }
  };
};

const notifyOfficers = () => {
  console.log("Notifying officers!");
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
          text: ":wave: Good evening, crew!"
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
            "If you have any questions :thinking_face: please reach out to the vice president!"
        }
      }
    ]
  });
};

module.exports = { notifyOfficers, postToSlack };
