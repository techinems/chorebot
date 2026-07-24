//node pacakges
const { google } = require("googleapis");
const moment = require("moment-timezone");
require("dotenv").config();

//local packages
const privatekey = require("../keys/sheets-api.json");
const { filterTodaysChores } = require("./chores.js");

//globals
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GDRIVE_EMAIL = process.env.GDRIVE_EMAIL;

// Object-form constructor is the stable API across modern googleapis versions
// (the old positional form is deprecated). Same service-account JWT auth.
const jwtClient = new google.auth.JWT({
  email: privatekey.client_email,
  key: privatekey.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  subject: GDRIVE_EMAIL,
});

const getChores = async () => {
  const sheets = google.sheets({
    version: "v4",
    auth: jwtClient
  });

  jwtClient.authorize(err => console.log(err ? err : "Successfully connected!"));

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "A2:B"
  });
  return data ? data.values : null;
};

const getTodaysChores = async () => {
  const today = moment().format("YYYY-MM-DD");
  const rows = await getChores();
  const todaysChores = filterTodaysChores(rows, today);
  return todaysChores.length === 0 ? -1 : todaysChores;
};

module.exports = { getTodaysChores };
