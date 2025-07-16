# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

**🖥️ NEW: Now available as a desktop application for Windows 10!** See [DESKTOP.md](DESKTOP.md) for details.

At the bottom of the page you'll find a simple contact form. Submissions are sent to the example Express server in `server/index.js` where they are logged to the console.

## 🚀 Quick Start

### Desktop Application

Run as a native desktop application:

```bash
npm install
npm run electron-dev  # Development mode
# or
npm run electron      # Production mode
```

For building Windows installers and more details, see [DESKTOP.md](DESKTOP.md).

### Web Application (Browser)

This site uses the browser's `fetch` API to load data. Browsers block `fetch`
requests when the page is opened with the `file://` scheme. Run a local server
so the page is served over `http://` or `https://` instead of opening
`public/index.html` directly:

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

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `PORT`: Server port (default: 3000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins for production
- `NODE_ENV`: Environment (development, production, test)

Example production configuration:
```bash
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
```

`npm start` launches `server/index.js` on port `3000`. Incoming contact form
submissions will be printed to the console. The Express server now serves the
repository's static files and enables CORS via the `cors` package so the
`/api/contact` endpoint can be accessed from other origins.

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

### GitHub Pages (Static Site Only)

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

**Note:** GitHub Pages hosts only the static files. The Express API server is 
**not** deployed there. If you deploy to Pages the contact form will appear but
submissions will fail because the backend is missing.

### Full Stack Deployment

For a complete deployment including the Express server, consider platforms like:

- **Heroku**: Create a `Procfile` with `web: node server/index.js`
- **Railway**: Supports Node.js apps automatically
- **Render**: Configure as a Node.js web service
- **Digital Ocean App Platform**: Configure as a Node.js app

Make sure to set the environment variables in your deployment platform:
- `NODE_ENV=production`
- `ALLOWED_ORIGINS=https://yourdomain.com`
- `PORT` (usually auto-configured by the platform)

## License

This project is released under the MIT License.
