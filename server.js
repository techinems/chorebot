//node packages
const cron = require("node-cron");
const axios = require('axios');
require("dotenv").config();

//local packages
const { app } = require("./utilities/bolt.js");
const { getTodaysChores } = require("./utilities/getChores.js");
const { sendNoChores, postToSlack } = require("./utilities/notify.js");
const { markChoreDone } = require("./utilities/markChoreDone.js");

//package configuration

//local configuration

//globals
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const WHITEBOARD_CRON_SCHEDULE = process.env.WHITEBOARD_CRON_SCHEDULE;
const WHITEBOARD_URL = process.env.WHITEBOARD_URL;

//helper functions
const runChores = async () => {
  console.log("Running ChoreBot!");
  const chores = await getTodaysChores();
  if (chores == -1) sendNoChores();
  // TODO: in the future, notify the officers that there are no chores
  else postToSlack(chores);
};

app.action(
  /^\d+$/,
  async ({ ack, next }) => {
    ack();
    next();
  },
  async ({
    action: { action_id },
    body: {
      user: { id: user },
      channel: { id: channel },
      message: { ts, blocks }
    }
  }) => {
    markChoreDone(action_id, user, channel, ts, blocks);
  }
);

cron.schedule(CRON_SCHEDULE, runChores);
cron.schedule(WHITEBOARD_CRON_SCHEDULE, async () => {
  let chores = await getTodaysChores();
  chores = chores === -1 ? {chores: []} : { chores }; 
  axios.post(`${WHITEBOARD_URL}/chores`, chores).catch((err) => console.error(err));
});
