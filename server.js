//node packages
const cron = require("node-cron");
require("dotenv").config();

//local packages
const { getTodaysChores } = require("./utilities/getChores.js");
const { notifyOfficers, postToSlack } = require("./utilities/notify.js");

//package configuration

//local configuration

//globals

// cron.schedule(
//   "0 18 * * *",
//   async () => {
//     const chores = await getTodaysChores();
//     if (chores == -1) notifyOfficers();
//     else postToSlack(chores);
//   },
//   {
//     timezone: "America/New_York"
//   }
// );

(async () => {
  const chores = await getTodaysChores();
  if (chores == -1) notifyOfficers();
  else postToSlack(chores);
})();
