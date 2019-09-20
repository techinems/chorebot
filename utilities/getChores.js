//node pacakges
const { google } = require("googleapis");
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

const request = {
  spreadsheetId: SPREADSHEET_ID,
  range: "A2:B"
};

const getChores = () => {
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

  sheets.spreadsheets.values.get(request, (err, response) => {
    if (err) {
      throw err;
    }

    console.log(response);
    return response;
  });
};

module.exports = { getChores };
