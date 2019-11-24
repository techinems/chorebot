//node packages
const bodyParser = require("body-parser");
const express = require("express");
const api = express();
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
const WEBSITE_ACCESS_TOKEN = process.env.WEBSITE_ACCESS_TOKEN;

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
    markChoreDone(action.action_id, body.user.id, body.channel.id, body.message.ts,
      body.message.blocks);
  }
);

cron.schedule(CRON_SCHEDULE, runChores);

api.use(bodyParser.json());

api.get("/get/chores", async (req, res) => {
    if (WEBSITE_ACCESS_TOKEN !== req.query.token) {
        res.sendStatus(403);
    } else {
        let chores = await getTodaysChores();
        chores = chores === -1 ? {chores: []} : {chores};
        res.send(chores);
    }
});

api.listen(80, function () {
    console.log("Started on PORT 80");
});
