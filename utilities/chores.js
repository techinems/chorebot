// Pure chore-filtering logic, no Google/Slack dependency, so it can be unit
// tested. Given the spreadsheet rows ([date, chore] pairs) and today's date
// string, return the list of chores scheduled for today.
//
// Guards against null/undefined rows (an empty sheet read) by treating it as
// "no chores", where the original code would throw on `.map`.
const filterTodaysChores = (rows, today) =>
  (rows || []).map((c) => (c[0] === today ? c[1] : null)).filter(Boolean);

module.exports = { filterTodaysChores };
