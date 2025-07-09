# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

At the bottom of the page you'll find a simple contact form. Submissions are sent to the example Express server in `server/index.js` where they are logged to the console.

## Running Locally

This site uses the browser's `fetch` API to load data. Browsers block `fetch`
requests when the page is opened with the `file://` scheme. Run a local server
so the page is served over `http://` or `https://` instead of opening
`index.html` directly:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000` in your browser.

## Node Setup

Install dependencies and run the demo API server:

```bash
npm install
npm start
```


`npm start` launches `server/index.js` on port `3000`. Incoming contact form
submissions will be printed to the console.

## Tests

Run the automated test suite with:

```bash
npm test
```

This uses Jest to verify the contact API responds correctly.

## API

`POST /api/contact`

Send a JSON payload with `name`, `email` and `message`. The server returns
`{ "status": "ok" }` after logging the submission.

## License

This project is released under the MIT License.
