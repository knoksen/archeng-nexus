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

## CDN Usage and Security

The page pulls in Tailwind and Font Awesome via CDN. These tags now include
Subresource Integrity (SRI) attributes and the Tailwind script loads using the
`defer` attribute so it does not block rendering.

If you prefer to avoid runtime CDN dependencies, you can install and bundle
Tailwind locally:

```bash
npm install tailwindcss
npx tailwindcss -i input.css -o output.css --minify
```

Then replace the CDN `<script>` with a link to the generated CSS file.

## Node Setup

Install dependencies and start the demo Express server that handles contact form submissions:

```bash
npm install
npm start
```

For CI environments, install dependencies with `npm ci` to ensure a clean
and reproducible build.


`npm start` launches `server/index.js` on port `3000`. Leave this process
running while you test the site. Every time the contact form is submitted the
details will be printed in this terminal window.

## Tests

To run the automated test suite first install dependencies, then run the tests:

```bash
npm install  # or npm ci
npm test
```

Running `npm install` (or `npm ci`) installs Jest and other dev dependencies used by the tests.

## API

`POST /api/contact`

Send a JSON payload with `name`, `email` and `message`. The server returns
`{ "status": "ok" }` after logging the submission.

## Deployment

This repository includes a GitHub Actions workflow that deploys the static site
to **GitHub Pages**. To enable it for your fork:

1. Open your repository's **Settings** and navigate to **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source and
   save.

On every push to the `main` branch the workflow runs the tests and publishes the
site. Once the workflow completes, visit:

```
https://<your-user>.github.io/archeng-nexus/
```

Replace `<your-user>` with your GitHub username to see the deployed site.

GitHub Pages hosts only the static files under `index.html` and `scripts/`. The
Express API server started with `npm start` is **not** deployed there. If you
deploy to Pages without running your own server the contact form will appear but
submissions will fail because the backend is missing.

## License

This project is released under the MIT License.
