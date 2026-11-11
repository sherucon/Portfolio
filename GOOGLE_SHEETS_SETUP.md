# Google Sheets setup

The chat writes one row per visitor.
The row is created when the visitor sends their name and is updated after every later answer.
No server keys live in the browser; the webhook URL stays in server environment variables.

## 1. Create the sheet

1. Create a new Google Sheet.
2. Open Extensions > Apps Script.
3. Replace the generated code with the contents of `google-apps-script/Code.gs`.
4. Change `SHARED_SECRET` to a long random string.
5. Save the project.

## 2. Deploy the webhook

1. In Apps Script, click Deploy > New deployment.
2. Select type: Web app.
3. Set Execute as: Me.
4. Set Who has access: Anyone.
5. Deploy and authorize the script.
6. Copy the Web app URL.

The script emails you when a visitor's row is first created, so approve the Gmail permission when prompted.
If you change the script later, use Deploy > Manage deployments > Edit > Version: New version.
That keeps the same `/exec` URL, so Vercel keeps working.
Creating a brand new deployment gives you a different URL; if you do that, copy it into the Vercel environment variable and redeploy the site.

The script creates the header row on the first submission.

## 3. Configure the site

Local development, in `.env.local`:

```bash
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
GOOGLE_SHEETS_WEBHOOK_SECRET="the same long random string"
```

Production, in the Vercel dashboard:

1. Open the `sherucon` project.
2. Go to Settings > Environment Variables.
3. Add both variables for Production (and Preview if you use preview deployments).
4. Redeploy the project so the running functions pick them up.

`.env.local` is gitignored and is only read by `npm run dev` and `npm run start`.
Restart the dev server after changing it.

## Columns

The script writes these columns in order:

- Created
- Session ID
- Name
- Topic
- Phone
- Email
- Anything else
- Status
- Updated
- User agent

Rows are matched by Session ID, so each visitor keeps one row while their answers are filled in.
Closing the page mid-conversation leaves that visitor's row marked "In progress".

## Troubleshooting

If the composer ends with "couldn't send, email me", check the logs for the function:

- Locally, the terminal running `npm run dev`.
- On Vercel, the project's Logs page (Functions tab).

The messages mean:

- `503 Google Sheets is not configured` means the environment variables were not loaded.
  Locally, both values must be in `.env.local` and the dev server must be restarted after editing it.
  On Vercel, both values must be in the project environment variables, and the project must be redeployed after adding them.
- `502 Sheet rejected the entry` means the webhook was reached but returned `{"ok":false}`.
  The usual cause is that `GOOGLE_SHEETS_WEBHOOK_SECRET` does not match `SHARED_SECRET` in the deployed Apps Script.
  Edit the deployed Apps Script, not only the copy in this repo.
- `502 Could not reach Google Sheets` means the deployment URL is wrong or the deployment is not public.
  Redeploy as a Web app with access set to "Anyone" and use the URL ending in `/exec`.
- No notification email arrives: open the Apps Script editor and check Executions.
  The first `MailApp` call needs Gmail authorization.
  Add a temporary function that calls `sendNewLeadEmail([...])` with dummy values, run it, and accept the prompt.
  If no prompt appears, run `ScriptApp.invalidateAuth()` once, then run the test function again.
  If it still fails, check `appsscript.json` for an explicit `oauthScopes` array and add `https://www.googleapis.com/auth/script.send_mail`.
  Also confirm the deployment points at the version that contains the email code.

A successful submission only shows the green check after the route confirms the sheet write succeeded.
