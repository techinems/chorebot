//node pacakges
const { google } = require("googleapis");
const moment = require("moment");
require("dotenv").config();

//local packages
const privatekey = require("../keys/sheets-api.json");

//globals
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  "slack@rpiambulance.com"
);

const getChores = async () => {
  const sheets = google.sheets({
    version: "v4",
    auth: jwtClient
  });

  jwtClient.authorize(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Successfully connected!");
    }
  });

  try {
    const {
      data: { values }
    } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "A2:B"
    });
    return values;
  } catch (error) {
    console.error(error);
  }
};

const getTodaysChore = async () => {
  const today = moment().format("YYYY-MM-DD");
  const chores = await getChores();
  for (let x = 0; x < chores.length; x++) {
    if (today == chores[x][0]) {
      return chores[x][1];
    }
  }
  return -1;
};

module.exports = { getTodaysChore };
