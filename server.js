//node packages
const cron = require("node-cron");
const Sentry = require("@sentry/node");
require("dotenv").config();

//local packages
const {Authorization} = require("./middleware/Authorization");
const {app, expressReceiver} = require("./utilities/bolt.js");
const {Notifications} = require("./utilities/Notifications");
const {Actions} = require("./utilities/Actions");
const {Chores} = require("./utilities/Chores");

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

//Initialize Classes
const chores = new Chores();
const notifications = new Notifications(chores);
const actions = new Actions();

app.action(
  /^\d+$/,
  async ({ ack, next }) => {
    ack();
    next();
  },
  async ({ action, body }) => {
    if (!action || !body || !body.user || !body.channel || !body.message) return;
      actions.markChoreDone(action.action_id, body.user.id, body.channel.id, body.message.ts,
      body.message.blocks);
  }
);

cron.schedule(CRON_SCHEDULE, notifications.runChores.bind(notifications));

expressReceiver.app.use((req, res, next) => {
    Authorization.authorization(req, res, next);
});

expressReceiver.app.get("/get/chores", async (req, res) => {
    let todayschores = await chores.getTodaysChores();
    todayschores = todayschores === -1 ? {chores: []} : {todayschores};
    res.send(todayschores);
});
