//node pacakges
const { google } = require("googleapis");
const moment = require("moment-timezone");
require("dotenv").config();

//local packages
const privatekey = require("../keys/sheets-api.json");

//globals
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GDRIVE_EMAIL = process.env.GDRIVE_EMAIL;

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  GDRIVE_EMAIL
);

const getChores = async () => {
  const sheets = google.sheets({
    version: "v4",
    auth: jwtClient
  });

  jwtClient.authorize(err => console.log(err ? err : "Successfully connected!"));

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "A2:B"
    });
    return data ? data.values : null;
  } catch (error) {
    console.error(error);
  }
};

const getTodaysChores = async () => {
  const today = moment().format("YYYY-MM-DD");
    const todaysChores = (await getChores()).map(c => c[0] === today ? c[1] : null);
  return todaysChores.length === 0 ? -1 : todaysChores;
};

module.exports = { getTodaysChores };
