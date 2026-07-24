//local packages
const {
  app: {
    client: {
      chat: { update }
    }
  }
} = require("./bolt.js");
const { crossOffAndTag } = require("./blocks.js");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;

//helper functions
const markChoreDone = async (index, user, channel, ts, initialBlocks) => {
  const blocks = crossOffAndTag(user, parseInt(index), initialBlocks);
  await update({ token: TOKEN, channel, ts, blocks });
};

module.exports = { markChoreDone };
