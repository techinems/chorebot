//node packages
const cron = require("node-cron");

//local packages
const { getChores } = require("./utilities/getChores.js");

//package configuration

//local configuration

//globals

// cron.schedule(
//   "0 18 * * *",
//   () => {
//     getChores();
//   },
//   { timezone: "America/New_York" }
// );

(async () => console.log(await getChores()))();
