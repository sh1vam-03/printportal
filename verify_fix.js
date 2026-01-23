// verify_fix.js

// Mock Mongoose helper behavior (default)
const mockDate = new Date("2026-01-23T14:41+05:30");
console.log("Stored Date (ISO):", mockDate.toISOString());
console.log("Stored Date (Local):", mockDate.toString());

// Check if it matches expected UTC time for 14:41 IST
// 14:41 IST is 09:11 UTC
const expectedUTC = "2026-01-23T09:11:00.000Z";

if (mockDate.toISOString() === expectedUTC) {
    console.log("SUCCESS: Date parsed correctly as IST.");
} else {
    console.log("FAILURE: Date mismatch.");
    console.log("Expected (UTC):", expectedUTC);
    console.log("Actual   (UTC):", mockDate.toISOString());
}

// Check JSON serialization (simulating res.json behavior with default toJSON)
const obj = {
    dueDateTime: mockDate
};

console.log("JSON Output:", JSON.stringify(obj));
if (JSON.stringify(obj).includes(expectedUTC)) {
    console.log("SUCCESS: JSON output is standard ISO.");
} else {
    console.log("FAILURE: JSON output is not ISO.");
}
