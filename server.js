//node packages
const cron = require("node-cron");
const axios = require("axios");
const Sentry = require("@sentry/node");
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
const WHITEBOARD_SERVER_URL = process.env.WHITEBOARD_SERVER_URL;

// Configure Sentry exception logging
if (process.env.SENTRY_DSN) {
  const sentryConfig = {
      dsn: process.env.SENTRY_DSN,
      release: `chorebot@${require("./package.json").version}`
  };
  if (process.env.ENVIRONMENT) sentryConfig.environment = process.env.ENVIRONMENT;
  Sentry.init(sentryConfig);
}

//helper functions
const runChores = async () => {
  console.log("Running ChoreBot!");
  const chores = await getTodaysChores();
  if (chores === -1) sendNoChores();
  // TODO: in the future, notify the officers that there are no chores
  else postToSlack(chores);
};

app.action(
  /^\d+$/,
  async ({ ack, next }) => {
    ack();
    next();
  },
  async ({ action, body }) => {
    if (!action || !body || !body.user || !body.channel || !body.message) return;
      await markChoreDone(action.action_id, body.user, body.channel.id, body.message.ts,
      body.message.blocks);
  }
);

cron.schedule(CRON_SCHEDULE, runChores);
cron.schedule(WHITEBOARD_CRON_SCHEDULE, async () => {
  let chores = await getTodaysChores();
  chores = chores === -1 ? {chores: []} : { chores }; 
  axios.post(`${WHITEBOARD_SERVER_URL}/chores`, chores).catch((err) => console.error(err));
});
