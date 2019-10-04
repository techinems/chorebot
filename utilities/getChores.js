//node pacakges
const { google } = require("googleapis");
const moment = require("moment-timezone");
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

const getTodaysChores = async () => {
  const today = moment().format("YYYY-MM-DD");
  const allChores = await getChores();
  let todaysChores = [];
  for (const chore of allChores) {
    if (today === chore[0]) todaysChores.push(chore[1]);
  }
  if (todaysChores.length == 0) return -1;
  else return todaysChores;
};

module.exports = { getTodaysChores };
