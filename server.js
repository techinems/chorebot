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

// getChores();

const { google } = require("googleapis");
const privatekey = require("./keys/sheets-api.json");
const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  "slack@rpiambulance.com"
);

jwtClient.authorize(err => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

// const sheets = google.sheets({
//   version: "v4",
//   auth: jwtClient
// });
