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
submissions will be printed to the console. Run the tests with `npm test`.

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
