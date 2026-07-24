// Pure Block Kit builders and block transforms, with no Slack/Bolt dependency,
// so they can be unit tested without starting the app.

const buildMarkdownSection = (text) => ({
  type: "section",
  text: { type: "mrkdwn", text },
});

const buildChoreElement = (chore, index) => {
  let section = buildMarkdownSection(`>${chore}`);
  section.accessory = {
    type: "button",
    text: {
      type: "plain_text",
      text: "Done!",
      emoji: true,
    },
    action_id: `${index}`,
  };
  return section;
};

// Cross off a completed chore in-place and tag the user who finished it.
// Preserved verbatim from the original markChoreDone implementation.
const crossOffAndTag = (user, index, blocks) => {
  const choreText = blocks[index + 2].text.text.replace("&gt;", "");
  blocks[index + 2].text.text = `>~${choreText}~ Completed by <@${user}>`;
  delete blocks[index + 2].accessory;
  return blocks;
};

module.exports = { buildMarkdownSection, buildChoreElement, crossOffAndTag };
