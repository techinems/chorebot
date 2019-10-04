//node packages
const moment = require("moment");

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
      value: `done_${moment().format("YYYY-MM-DD")}_${index}`
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
          text: ":+1: There are no chores tonight! Have fun on crew!"
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

module.exports = { sendNoChores, postToSlack };
