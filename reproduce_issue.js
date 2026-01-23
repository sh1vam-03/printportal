// reproduce_issue.js
const dueDateTimeInput = "2026-01-23T14:41"; // What the client sends
const date = new Date(dueDateTimeInput);

console.log("Input:", dueDateTimeInput);
console.log("Parsed Date (local):", date.toString());
console.log("Parsed Date (ISO):", date.toISOString());

// improved parsing for IST
const istDate = new Date(dueDateTimeInput + "+05:30");
console.log("Parsed with IST offset:", istDate.toString());
console.log("Parsed with IST offset (ISO):", istDate.toISOString());
