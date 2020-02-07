//node packages
const cron = require("node-cron");
const Sentry = require("@sentry/node");
require("dotenv").config();

//local packages
const {authorization} = require("./middleware/Authorization");
const {app, expressReceiver} = require("./utilities/bolt.js");
const {runChores} = require("./utilities/Notifications");
const {markChoreDone} = require("./utilities/Actions");
const {getTodaysChores} = require("./utilities/Chores");

//globals
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;

// Configure Sentry exception logging
if (process.env.SENTRY_DSN) {
  const sentryConfig = {
      dsn: process.env.SENTRY_DSN,
      release: `chorebot@${require("./package.json").version}`
  };
  if (process.env.ENVIRONMENT) sentryConfig.environment = process.env.ENVIRONMENT;
  Sentry.init(sentryConfig);
}


app.action(
  /^\d+$/,
  async ({ ack, next }) => {
    ack();
    next();
  },
  async ({ action, body }) => {
    if (!action || !body || !body.user || !body.channel || !body.message) return;
      markChoreDone(action.action_id, body.user.id, body.channel.id, body.message.ts,
      body.message.blocks);
  }
);

cron.schedule(CRON_SCHEDULE, runChores);

expressReceiver.app.use((req, res, next) => {
    authorization(req, res, next);
});

expressReceiver.app.get("/get/chores", async (req, res) => {
    let todayschores = await getTodaysChores();
    todayschores = todayschores === -1 ? {chores: []} : {todayschores};
    res.send(todayschores);
});
