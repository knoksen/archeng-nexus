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

- Node.js 16 or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run electron-dev
```

This will:
- Start the Express.js server on port 3000
- Launch the Electron application
- Open developer tools for debugging

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
- Starts the Express.js server as a child process
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
- **Sandbox**: Configurable for different environments
- **Content Security Policy**: Inherited from the web application
- **External Link Handling**: Opens external links in default browser

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

1. **Port 3000 already in use**
   - Close any other applications using port 3000
   - The application will fail to start if the port is occupied

2. **Missing dependencies**
   - Run `npm install` to ensure all dependencies are installed
   - Electron requires specific native dependencies

3. **Build failures**
   - Ensure you have the latest version of Node.js
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Sandbox issues in development**
   - The application runs with `--no-sandbox` flag for compatibility
   - This is normal for development environments

### Development Tips

- Use `npm run electron-dev` for development with hot reloading
- DevTools are automatically opened in development mode
- Server logs appear in the Electron console
- Use the View menu to access reload and developer tools

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