# ArchEng Nexus Desktop Application

ArchEng Nexus is now available as a desktop application for Windows 10 and other platforms. The desktop app packages the web interface and Express.js server into a native desktop application using Electron.

## Features

- **Native Desktop Experience**: Runs as a standalone desktop application
- **Full Web Functionality**: Includes all features from the web version
- **Integrated Server**: Express.js server runs automatically in the background
- **Cross-Platform**: Built with Electron for Windows, macOS, and Linux
- **Professional UI**: Native window controls and application menus

## Development

### Prerequisites

- Node.js 22 or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm ci
```

2. Run in development mode:
```bash
npm run electron-dev
```

This will:
- Start the Express.js server on an available loopback port
- Launch the Electron application
- Open developer tools for debugging

The desktop server binds only to `127.0.0.1`; it does not expose the local API
to other devices on the network. It uses an ephemeral port by default, or the
`PORT` environment variable when supplied. The application waits for an
explicit server ready signal before loading the window. If the server cannot
start, including an explicitly configured port conflict, the application
reports the startup error instead of retrying on a timer.

### Building

#### Development Build
```bash
npm run pack
```
Creates an unpacked development build in `dist/` directory.

#### Production Build for Windows
```bash
npm run build-win
```
Creates a Windows installer (NSIS) in the `dist/` directory.

#### Universal Build
```bash
npm run build
```
Creates builds for the current platform.

### Scripts

- `npm run electron` - Run the desktop app (production mode)
- `npm run electron-dev` - Run in development mode with DevTools
- `npm run pack` - Create unpacked build for testing
- `npm run build` - Create distributable build
- `npm run build-win` - Create Windows installer
- `npm test` - Run all tests including desktop app tests

## Architecture

The desktop application consists of:

### Main Process (`main.js`)
- Manages the application lifecycle
- Creates and manages browser windows
- Starts the Express.js server as a child process and waits for readiness
- Shuts down the child process through an IPC message when the app exits
- Handles application menus and system integration

### Renderer Process
- Displays the web interface using the existing HTML/CSS/JavaScript
- Communicates with the Express.js server via HTTP
- Maintains the same functionality as the web version

### Server Process
- Express.js server runs in the background
- Handles contact form submissions
- Serves static files and API endpoints
- Same functionality as the standalone web server

## Security

The desktop application includes several security measures:

- **Context Isolation**: Enabled to prevent code injection
- **Node Integration**: Disabled in renderer process
- **Sandbox**: Enabled in development and packaged builds
- **Web Security**: Enabled; insecure content is not allowed
- **External Link Handling**: Only valid HTTP(S) URLs without embedded credentials
  are opened in the default browser; unsafe schemes are blocked
- **Local Server**: Bound to loopback on a dynamically assigned port

## Windows-Specific Features

- **NSIS Installer**: Professional Windows installer with options
- **Desktop Shortcuts**: Creates desktop and start menu shortcuts
- **Windows Icon**: Proper .ico format icon for Windows integration
- **Auto-updater Ready**: Configuration prepared for future updates

## File Structure

```
/
├── main.js                 # Main Electron process
├── assets/                 # Application icons and resources
│   ├── icon.png           # Application icon (PNG)
│   ├── icon.ico           # Windows icon (ICO)
│   └── icon.svg           # Vector icon source
├── server/                # Express.js server
├── public/                # Web interface files
├── __tests__/             # Tests including desktop app tests
└── dist/                  # Build output (created after building)
```

## Configuration

The desktop application is configured in `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.archeng.nexus",
    "productName": "ArchEng Nexus",
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **The application server cannot start**
   - Check the displayed startup error and server output in the Electron console
   - The desktop app uses an ephemeral port by default; `npm start` uses port 3000

2. **Missing dependencies**
   - Run `npm install` to ensure all dependencies are installed
   - Electron requires specific native dependencies

3. **Build failures**
   - Ensure you have the latest version of Node.js
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Development Tips

- Use `npm run electron-dev` for development with hot reloading
- DevTools are automatically opened in development mode
- Non-sensitive server diagnostics appear in the Electron console
- Use the View menu to access reload and developer tools

### Tests

Run the API, Electron security, and child-server lifecycle regression tests with:

```bash
npm ci
npm test
```

The tests cover readiness signaling, clean shutdown, occupied-port reporting,
URL scheme validation, CORS allowlisting, validation, payload size, and rate
limiting. A Windows installer still needs to be built and exercised on Windows
before claiming installer verification.

## Future Enhancements

Potential improvements for the desktop application:

- **Auto-updater**: Automatic application updates
- **System Tray**: Minimize to system tray functionality  
- **Native Notifications**: Desktop notifications for form submissions
- **File System Integration**: Save/load project files
- **Offline Mode**: Cache functionality for offline use
- **Multi-window Support**: Multiple project windows

## License

Same as the main project - MIT License.