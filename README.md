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

If you plan to use Node for dependency management, run:

```bash
npm install
```

### Running Tests

This project uses [Jest](https://jestjs.io/) for unit testing. After
installing dependencies you can run all tests with:

```bash
npm test
```

The included test checks that toggling the theme correctly updates
`localStorage`.

## License

This project is released under the MIT License.
