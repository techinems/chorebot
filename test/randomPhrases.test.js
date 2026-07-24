const { randomPhrase, phrases } = require("../utilities/randomPhrases.js");

describe("randomPhrase", () => {
  test("returns a phrase from the requested category", () => {
    expect(phrases.greeting).toContain(randomPhrase("greeting"));
    expect(phrases.no_chore).toContain(randomPhrase("no_chore"));
  });

  test("does NOT mutate the shared phrases.request array", () => {
    const before = phrases.request.length;
    for (let i = 0; i < 50; i++) {
      randomPhrase("request");
    }
    expect(phrases.request.length).toBe(before);
  });

  test("a request phrase is always a non-empty string", () => {
    const p = randomPhrase("request");
    expect(typeof p).toBe("string");
    expect(p.length).toBeGreaterThan(0);
  });
});
