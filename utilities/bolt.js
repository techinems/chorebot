//node packages
const {App, ExpressReceiver} = require("@slack/bolt");

//globals
const PORT = process.env.NODE_PORT || 3000;
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;

const expressReceiver = new ExpressReceiver({
    signingSecret: SECRET
});

//package config
const app = new App({
    token: TOKEN,
    receiver: expressReceiver
});

(async () => {
  await app.start(PORT);
  console.log(
      `${new Date()}: ChoreBot running on port ${PORT}...`
  );
  console.log(`cron schedule: "${CRON_SCHEDULE}"`);
})();


module.exports = {app, expressReceiver};
