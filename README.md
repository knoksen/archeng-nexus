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

Install dependencies and run the demo API server:

```bash
npm install
npm start
```


`npm start` launches `server/index.js` on port `3000`. Incoming contact form
submissions will be printed to the console. The Express server now serves the
repository's static files and enables CORS via the `cors` package so the
`/api/contact` endpoint can be accessed from other origins.

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

## License

This project is released under the MIT License.
