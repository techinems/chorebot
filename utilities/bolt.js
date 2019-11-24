//node packages
const {App, ExpressReceiver} = require("@slack/bolt");
const moment = require("moment-timezone");

//local packages
const {getTodaysChores} = require("./getChores.js");

//globals
const PORT = process.env.NODE_PORT || 3000;
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const API_VERIFICATION = process.env.API_VERIFICATION_TOKEN;

const expressReceiver = new ExpressReceiver({
    signingSecret: SECRET
});

//package config
const app = new App({
  token: TOKEN,
    receiver: expressReceiver
});

expressReceiver.app.get("/get/chores", async (req, res) => {
    if (API_VERIFICATION !== req.query.token) {
        res.sendStatus(403);
    } else {
        let chores = await getTodaysChores();
        chores = chores === -1 ? {chores: []} : {chores};
        res.send(chores);
    }
});


(async () => {
  await app.start(PORT);
  console.log(
    `${moment().tz("America/New_York")}: ChoreBot running on port ${PORT}...`
  );
  console.log(`cron schedule: "${CRON_SCHEDULE}"`);
})();


module.exports = { app };
