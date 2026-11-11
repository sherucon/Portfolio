/**
 * Google Apps Script webhook for the portfolio contact chat.
 *
 * Paste this file into Extensions > Apps Script inside the Google Sheet,
 * replace SHARED_SECRET, then deploy it as a web app.
 * Full setup steps are in GOOGLE_SHEETS_SETUP.md.
 */

const SHARED_SECRET = "REPLACE_ME";
const SPREADSHEET_ID = "";
const HEADERS = [
  "Created",
  "Session ID",
  "Name",
  "Topic",
  "Phone",
  "Email",
  "Anything else",
  "Status",
  "Updated",
  "User agent",
];

/** Where new-lead notifications are sent. */
const NOTIFY_EMAIL = "singhshreyansh288@gmail.com";

function sendNewLeadEmail(values) {
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New portfolio lead: ${values[2] || "unknown"}`,
      body: [
        `Name: ${values[2] || "-"}`,
        `Topic: ${values[3] || "-"}`,
        `Phone: ${values[4] || "-"}`,
        `Email: ${values[5] || "-"}`,
        `Anything else: ${values[6] || "-"}`,
        `Status: ${values[7] || "-"}`,
        `Session: ${values[1] || "-"}`,
        `Created: ${values[0]}`,
      ].join("\n"),
    });
  } catch (error) {
    // A failed email must not fail the sheet write.
    console.error("Lead email failed", error);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");

    if (SHARED_SECRET && data.secret !== SHARED_SECRET) {
      return json({ ok: false, error: "unauthorized" });
    }

    const sheet = getSheet();
    ensureHeaders(sheet);

    const now = new Date();
    const sessionId = clean(data.sessionId);
    const rowValues = [
      now,
      sessionId,
      clean(data.name),
      clean(data.topic),
      clean(data.phone),
      clean(data.email),
      clean(data.notes),
      data.complete === true ? "Complete" : "In progress",
      now,
      clean(data.userAgent),
    ];

    const row = findRow(sheet, sessionId);
    if (row === -1) {
      sheet.appendRow(rowValues);
      sendNewLeadEmail(rowValues);
    } else {
      rowValues[0] = sheet.getRange(row, 1).getValue() || now;
      sheet.getRange(row, 1, 1, rowValues.length).setValues([rowValues]);
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Set SPREADSHEET_ID when the script is not bound to a sheet");
  }

  return spreadsheet.getSheets()[0];
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#f3f3f3");
}

function findRow(sheet, sessionId) {
  if (!sessionId || sheet.getLastRow() < 2) return -1;

  const sessionIds = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  const index = sessionIds.findIndex((row) => row[0] === sessionId);
  return index === -1 ? -1 : index + 2;
}

function clean(value) {
  return typeof value === "string" ? value.trim().slice(0, 1000) : "";
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
