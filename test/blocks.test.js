const {
  buildMarkdownSection,
  buildChoreElement,
  crossOffAndTag,
} = require("../utilities/blocks.js");

describe("buildMarkdownSection", () => {
  test("builds a mrkdwn section", () => {
    expect(buildMarkdownSection("hi")).toEqual({
      type: "section",
      text: { type: "mrkdwn", text: "hi" },
    });
  });
});

describe("buildChoreElement", () => {
  test("quotes the chore and attaches a Done! button with the index action_id", () => {
    const el = buildChoreElement("Sweep the bay", 2);
    expect(el.text.text).toBe(">Sweep the bay");
    expect(el.accessory.type).toBe("button");
    expect(el.accessory.text.text).toBe("Done!");
    expect(el.accessory.action_id).toBe("2");
  });
});

describe("crossOffAndTag", () => {
  test("strikes through the chore, tags the user, removes the button", () => {
    // crossOffAndTag operates on blocks[index + 2]. In an action payload Slack
    // has HTML-escaped the leading ">" of the quoted chore to "&gt;".
    const blocks = [
      { type: "section", text: { type: "mrkdwn", text: "greeting" } },
      { type: "section", text: { type: "mrkdwn", text: "Tonight's chores:" } },
      {
        type: "section",
        text: { type: "mrkdwn", text: "&gt;Sweep the bay" },
        accessory: { type: "button" },
      },
    ];
    const result = crossOffAndTag("U123", 0, blocks);
    expect(result[2].text.text).toBe(">~Sweep the bay~ Completed by <@U123>");
    expect(result[2].accessory).toBeUndefined();
  });
});
