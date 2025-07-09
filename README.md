# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

At the bottom of the page you'll find a simple contact form. Visitors can use it to send questions or project inquiries. The form currently displays a success message in the browser and can be hooked up to a backend service later.

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

The repository does not include a Node.js application. `package.json` only defines a few optional scripts. There are no dependencies, so you can skip `npm install` or run it with the `--offline` flag if desired.

Run the placeholder test script with:

```bash
npm test
```

## License

This project is released under the MIT License.
