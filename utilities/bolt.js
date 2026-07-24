//node packages
const { App, HTTPReceiver } = require("@slack/bolt");
const moment = require("moment-timezone");

//local packages

//globals
const PORT = process.env.NODE_PORT || 3000;
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;

//package config
// Custom HTTPReceiver so we can expose a /health route for container health
// checks. The Slack events endpoint (/slack/events) and its signing-secret
// verification are unchanged from Bolt's defaults.
const receiver = new HTTPReceiver({
  signingSecret: SECRET,
  customRoutes: [
    {
      path: "/health",
      method: ["GET"],
      handler: (req, res) => {
        res.writeHead(200);
        res.end("ok");
      },
    },
  ],
});

const app = new App({
  token: TOKEN,
  receiver,
});

app.error((error) => {
  console.error("Bolt app error:", error);
  return Promise.resolve();
});

(async () => {
  await app.start(PORT);
  console.log(
    `${moment().tz("America/New_York")}: ChoreBot running on port ${PORT}...`
  );
  console.log(`cron schedule: "${CRON_SCHEDULE}"`);
})();

module.exports = { app };
