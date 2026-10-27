const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const { startServer, stopServer } = require('./desktop/server-manager');
const { isAllowedExternalUrl } = require('./desktop/url-security');

const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;
let isStoppingServer = false;
let allowQuit = false;

function openExternalUrl(candidate) {
  if (!isAllowedExternalUrl(candidate)) {
    return;
  }

  shell.openExternal(candidate).catch((error) => {
    console.error('Failed to open external URL:', error.message);
  });
}

function createWindow(baseUrl) {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  const appOrigin = new URL(baseUrl).origin;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    },
    icon: iconPath,
    show: false,
    titleBarStyle: 'default',
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    let targetOrigin;
    try {
      targetOrigin = new URL(url).origin;
    } catch {
      event.preventDefault();
      return;
    }

    if (targetOrigin === appOrigin) {
      return;
    }

    event.preventDefault();
    openExternalUrl(url);
  });

  mainWindow.loadURL(baseUrl).catch((error) => {
    console.error('Failed to load application:', error.message);
    dialog.showErrorBox('ArchEng Nexus failed to load', 'The local application server could not be reached.');
    app.quit();
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About ArchEng Nexus',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About ArchEng Nexus',
              message: 'ArchEng Nexus',
              detail: 'Next-generation architecture and engineering platform with AI automation and sustainable materials.',
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  try {
    const serverPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'server', 'index.js')
      : path.join(__dirname, 'server', 'index.js');
    const startedServer = await startServer({
      serverPath,
      host: '127.0.0.1',
      port: process.env.PORT || 0,
    });

    serverProcess = startedServer.child;
    serverProcess.once('exit', (code, signal) => {
      if (!allowQuit && !isStoppingServer) {
        console.error(`Local application server stopped unexpectedly (code ${code}, signal ${signal}).`);
        dialog.showErrorBox('ArchEng Nexus server stopped', 'The local application server stopped unexpectedly.');
        app.quit();
      }
    });

    createWindow(startedServer.url);
    createMenu();
  } catch (error) {
    console.error('Failed to start application:', error.message);
    dialog.showErrorBox('ArchEng Nexus failed to start', error.message);
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && serverProcess) {
    createWindow(`http://127.0.0.1:${serverProcess.archengPort}`);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  if (!serverProcess || allowQuit) {
    return;
  }

  event.preventDefault();
  if (isStoppingServer) {
    return;
  }

  isStoppingServer = true;
  stopServer(serverProcess)
    .catch((error) => {
      console.error('Failed to stop local application server cleanly:', error.message);
    })
    .finally(() => {
      serverProcess = null;
      allowQuit = true;
      app.quit();
    });
});
