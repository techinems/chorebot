//node packages
const {google} = require("googleapis");
require("dotenv").config();

//local packages
const privatekey = require("../keys/sheets-api.json");

//globals
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GDRIVE_EMAIL = process.env.GDRIVE_EMAIL;

class Chores {
    constructor() {
        this.jwtClient = new google.auth.JWT(
            privatekey.client_email,
            null,
            privatekey.private_key,
            ["https://www.googleapis.com/auth/spreadsheets.readonly"],
            GDRIVE_EMAIL
        );
    }

    async getTodaysChores() {
        const now = new Date();
        const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
            .toISOString().split("T")[0];
        const todaysChores = (await this.getChores()).map(c => c[0] === today ? c[1] : null).filter(Boolean);
        return todaysChores.length === 0 ? -1 : todaysChores;
    }


    async getChores() {
        const sheets = google.sheets({
            version: "v4",
            auth: this.jwtClient
        });

        this.jwtClient.authorize(err => console.log(err ? err : "Successfully connected to Google Sheets!"));
        try {
            const {data} = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: "A2:B"
            });
            return data ? data.values : null;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {Chores};
