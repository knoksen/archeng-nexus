# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

**🖥️ NEW: Now available as a desktop application for Windows 10!** See [DESKTOP.md](DESKTOP.md) for details.

At the bottom of the page you'll find a sample contact form. The example
Express endpoint validates submissions and returns an acknowledgement; it does
not deliver or persist messages.

## 🚀 Quick Start

### Desktop Application

Run as a native desktop application:

```bash
npm ci
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

Install dependencies and start the demo Express server:

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
- `TRUST_PROXY`: Set to `1` only behind one trusted reverse proxy
- `NODE_ENV`: Environment (development, production, test)

Example production configuration:
```bash
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
TRUST_PROXY=1
NODE_ENV=production
```

`npm start` launches `server/index.js` on port `3000` (or `PORT` if configured)
and serves the static files. Contact submissions are not logged or persisted.
Cross-origin access is denied unless each exact origin is listed in
`ALLOWED_ORIGINS`; same-origin browser requests do not require CORS configuration.
The contact endpoint limits the request body to 10 KB and allows up to five
submissions per client IP in a 15-minute window.

Set `TRUST_PROXY=1` only when the server is behind exactly one trusted reverse
proxy. It is disabled by default so clients cannot spoof their IP address for
rate-limit decisions.

## Tests

To run the automated test suite first install dependencies, then run the tests:

```bash
npm install  # or npm ci
npm test
```

Running `npm install` (or `npm ci`) installs Jest and other dev dependencies used by the tests.

## API

`POST /api/contact`

Send a JSON payload with string fields `name`, `email` and `message`. Name is
limited to 100 characters and message to 1,000 characters. The server returns
`{ "status": "ok" }` for valid input; this demo endpoint does not deliver or
persist the message. Invalid input returns field-level messages without echoing
submitted values.

## Deployment

### GitHub Pages (Static Site Only)

The single authoritative GitHub Pages pipeline is
`.github/workflows/deploy.yml`. It runs tests, builds the repository-root
Jekyll site, and checks that the `public/` subtree is included unchanged.
Pull requests run the build and validation but do not deploy. The root build
preserves the currently published documentation at `/` and keeps the
application under `/public/`.

To enable Pages for your fork:

1. Open your repository's **Settings** and navigate to **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source and
   save.

On pushes to `main`, the workflow tests and validates the Pages artifact before
deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for the artifact comparison and
rollback procedure.

Once deployment completes, visit:

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
