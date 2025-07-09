# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

At the bottom of the page you'll find a simple contact form. It is fully client-side, so submissions never leave the browser. Use the example server in `server.js` or your own backend to capture messages.

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

If you plan to use Node for dependency management, run:

```bash
npm install
```

### Example Contact Endpoint
Install `express` (e.g., `npm install express`) and run `node server.js` to test form submissions locally. The sample server simply logs incoming JSON and returns a confirmation.

The project currently has no automated tests. The `package.json` contains a
placeholder test script that simply echoes a message when you run:

```bash
npm test
```

## License

This project is released under the MIT License.
