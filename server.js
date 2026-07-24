//node packages
const cron = require("node-cron");
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
const ENABLE = process.env.ENABLE == "true" ? true : false;

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
  try {
    const chores = await getTodaysChores();
    if (chores === -1) await sendNoChores();
    // TODO: in the future, notify the officers that there are no chores
    else await postToSlack(chores);
  } catch (err) {
    console.error("Failed to run chores:", err);
  }
};

app.action(
  /^\d+$/,
  async ({ ack, next }) => {
    await ack();
    await next();
  },
  async ({ action, body }) => {
    if (!action || !body || !body.user || !body.channel || !body.message) return;
    await markChoreDone(
      action.action_id,
      body.user.id,
      body.channel.id,
      body.message.ts,
      body.message.blocks
    );
  }
);

if (ENABLE) {
  cron.schedule(CRON_SCHEDULE, runChores);
  cron.schedule(WHITEBOARD_CRON_SCHEDULE, async () => {
    try {
      let chores = await getTodaysChores();
      chores = chores === -1 ? { chores: [] } : { chores };
      await fetch(`${WHITEBOARD_SERVER_URL}/chores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chores)
      });
    } catch (err) {
      console.error(err);
    }
  });
}
