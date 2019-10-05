//node packages
const cron = require("node-cron");
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
