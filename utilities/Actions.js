//local packages
const {
    app: {
        client: {
            chat: {update}
        }
    }
} = require("./bolt.js");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;


const markChoreDone = (index, user, channel, ts, initialBlocks) => {
    const blocks = crossOffAndTag(user, parseInt(index), initialBlocks);
    update({token: TOKEN, channel, ts, blocks});
};

//helper functions

const crossOffAndTag = (user, index, blocks) => {
        const choreText = blocks[index + 2].text.text.replace("&gt;", "");
        blocks[index + 2].text.text = `>~${choreText}~ Completed by <@${user}>`;
        delete blocks[index + 2].accessory;
        return blocks;
};

module.exports = {markChoreDone};
