# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

At the bottom of the page you'll find a simple contact form. Visitors can use it to send questions or project inquiries. The form currently displays a success message in the browser and can be hooked up to a backend service later.

## Running Locally

Open `index.html` directly in a browser or start a simple web server:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Node Setup

If you plan to use Node for dependency management, run:

```bash
npm install
```

The project currently has no automated tests. The `package.json` contains a
placeholder test script that simply echoes a message when you run:

```bash
npm test
```

## License

This project is released under the MIT License.
