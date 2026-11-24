# UPI Ledger 2.0 – iPhone web app

No Mac or Xcode needed. This is a static web app, not an App Store app. No bank credentials, backend, or analytics are used by this code.

## Install using only an iPhone
1. Download the ZIP and tap it in the iPhone Files app to extract it.
2. In Safari, sign in to GitHub and create a new public repository named `upi-ledger` (free GitHub Pages requires a public repository). Upload only the included app files into the root of the repository using Add file > Upload files (request Desktop Website in Safari if needed). Do not upload transaction logs or backups. Keep the original names. Commit the upload.
3. Open repository Settings > Pages. Select Deploy from a branch, main, / (root), and Save. Open the published HTTPS URL when it is available. See https://docs.github.com/en/pages/quickstart and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site .
4. In Safari, tap Share > Add to Home Screen, turn on Open as Web App if shown, and tap Add. Launch from the new icon. Use this installed app consistently, since Safari and the app can have separate data.
5. The app caches its files for offline use after the first successful online load; check by opening in airplane mode.

## Expense reports
Overview: tap Today, This week (Monday to today), This month, Last month, This year, All time, or Custom. Both start and end dates are inclusive. For a single date, enter the same date twice. Totals, category breakdown, daily spending and transaction count update. Daily average includes all calendar days in the range; for open-ended ranges, missing boundaries use the earliest/latest matching transaction. Monthly budget is always for the current calendar month, independent of the report. Activity uses the same range and supports category/search filters; Export CSV exports the currently filtered transactions. CSV opens in Numbers or Excel.

## UPI SMS capture using Shortcuts (optional; test on your own device)
The web app cannot read your SMS inbox or run a background SMS listener. You can paste a bank debit SMS directly into Import & data, enter its date, then review and save the parsed details. Alternatively try this iPhone-only logging automation:
1. In Shortcuts, select Automation > + > Message. Restrict the sender to your bank if possible and Message Contains to UPI. Choose Run Immediately if available.
2. Create a blank automation. Use the message content from Shortcut Input (if your iOS version exposes it; select the message body, not a contact). Add Current Date, Format Date with custom yyyy-MM-dd, and Text containing the formatted date, a literal space-pipe-space, and the message content on the same line. Ensure each record is on a separate line.
3. Use Append to Text File, choose a folder in Files/iCloud Drive such as Shortcuts, set file name upi-ledger.txt and enable Make New Line if available. Run the automation with a test bank SMS; check that the file actually contains the date and body. If the trigger does not supply the message body or cannot run without interaction, use paste or manual entry instead.
4. Open the Home Screen UPI Ledger app, Import & data, select the text file and review the proposed entries. Tap Save selected. This is a batch import, not automatic dashboard synchronisation. Reimporting known reference numbers is safe; items without a reference are unchecked by default and require manual duplicate review. Date is SMS receipt date unless corrected. The log itself contains raw messages and may sync via iCloud; restrict access and delete it when no longer needed. Never use OTP messages.

## Data
The app stores parsed expenses and budget in localStorage on your device; data is not encrypted separately by this app, and there is no Face ID lock. Clearing website data/removing the app or storage eviction can cause loss. Export JSON backups regularly and store privately; restore merges records by ID or UPI reference. No real sample data is included. SMS parser is heuristic, not a bank-certified integration. Bank formats vary; review extracted amounts and payees. Self transfers and refunds are not automatically reconciled. Edit/delete incorrect expenses. The source files may be public if hosted on GitHub, but your records remain in your browser unless you deliberately upload them. Use an HTTPS host you control and do not add third-party scripts.

## Validation
20 Node core assertions passed for presets, inclusive ranges, date validation, example SMS parsing, rejection of non-UPI/failed/credit messages, duplicate reference handling, sum, log and CSV. JavaScript syntax checked. Actual iPhone Safari, Shortcuts and installation have not been device-tested. No live site has been published from this environment.
