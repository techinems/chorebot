//node packages
const {google} = require("googleapis");
require("dotenv").config();

//local packages
const {
    app: {
        client: {
            chat: { update }
        }
    }
} = require("./bolt.js");
const privatekey = require("../keys/sheets-api.json");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GDRIVE_EMAIL = process.env.GDRIVE_EMAIL;

const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"],
    GDRIVE_EMAIL
);

const markChoreUser = async (user, date, choretext) => {
    const sheets = google.sheets({
        version: "v4",
        auth: jwtClient
    });

    jwtClient.authorize(err => console.log(err ? err : "Successfully connected!"));

    try {
        const {data} = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "A2:B"
        });
        for (let n = 0; n < data.values.length; n++) {
            if (data.values[n][1] === choretext && data.values[n][0] === date) {
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `Sheet1!C${n + 2}:D${n + 2}`,
                    valueInputOption: 'USER_ENTERED',
                    resource: {values: [[user.name, user.id]]}
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

//helper functions
const crossOffAndTag = (user, index, blocks) => {
    const choreText = blocks[index + 2].text.text.replace("&gt;", "");
    blocks[index + 2].text.text = `>~${choreText}~ Completed by <@${user}>`;
    delete blocks[index + 2].accessory;
    return blocks;
};

const markChoreDone = async (index, user, channel, ts, initialBlocks) => {
    await markChoreUser(user, formatDate(new Date(ts * 1000)), initialBlocks[parseInt(index) + 2].text.text.replace("&gt;", ""));
    const blocks = crossOffAndTag(user.id, parseInt(index), initialBlocks);
    update({ token: TOKEN, channel, ts, blocks });
};

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

module.exports = { markChoreDone };
