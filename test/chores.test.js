const { filterTodaysChores } = require("../utilities/chores.js");

describe("filterTodaysChores", () => {
  const rows = [
    ["2026-07-24", "Take out the trash"],
    ["2026-07-25", "Restock the rig"],
    ["2026-07-24", "Sweep the bay"],
  ];

  test("returns only chores matching today's date", () => {
    expect(filterTodaysChores(rows, "2026-07-24")).toEqual([
      "Take out the trash",
      "Sweep the bay",
    ]);
  });

  test("returns empty array when no chores match", () => {
    expect(filterTodaysChores(rows, "2026-12-31")).toEqual([]);
  });

  test("treats null/undefined rows as no chores (no crash)", () => {
    expect(filterTodaysChores(null, "2026-07-24")).toEqual([]);
    expect(filterTodaysChores(undefined, "2026-07-24")).toEqual([]);
  });
});
