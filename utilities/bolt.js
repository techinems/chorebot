//node packages
const { App } = require("@slack/bolt");
const moment = require("moment-timezone");

//local packages

//globals
const PORT = process.env.NODE_PORT || 3000;
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;

//package config
const app = new App({
  token: TOKEN,
  signingSecret: SECRET
});

(async () => {
  await app.start(PORT);
  console.log(
    `${moment().tz("America/New_York")}: ChoreBot running on port ${PORT}...`
  );
  console.log(`cron schedule: "${CRON_SCHEDULE}"`);
})();

module.exports = { app };
