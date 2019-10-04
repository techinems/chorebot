//local packages
const {
  app: {
    client: {
      chat: { update }
    }
  }
} = require("./bolt.js");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;

//helper functions
const crossOffAndTag = (user, index, blocks) => {
  const choreText = blocks[index + 2].text.text.replace("&gt;", "");
  blocks[index + 2].text.text = `>~${choreText}~ Completed by <@${user}>`;
  return blocks;
};

const markChoreDone = (index, user, channel, ts, blocks) => {
  update({
    token: TOKEN,
    channel: channel,
    ts: ts,
    blocks: crossOffAndTag(user, parseInt(index), blocks)
  });
};

module.exports = { markChoreDone };
