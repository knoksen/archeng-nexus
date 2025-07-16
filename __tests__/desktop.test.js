const path = require('path');
const fs = require('fs');

describe('Desktop Application', () => {
  test('package.json should have electron scripts', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.main).toBe('main.js');
    expect(packageJson.scripts.electron).toBeDefined();
    expect(packageJson.scripts['electron-dev']).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts['build-win']).toBeDefined();
  });

  test('should have required electron dependencies', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.devDependencies.electron).toBeDefined();
    expect(packageJson.devDependencies['electron-builder']).toBeDefined();
  });

  test('main.js should exist and be properly configured', () => {
    const mainPath = path.join(__dirname, '..', 'main.js');
    expect(fs.existsSync(mainPath)).toBe(true);
    
    const mainContent = fs.readFileSync(mainPath, 'utf8');
    expect(mainContent).toContain('BrowserWindow');
    expect(mainContent).toContain('app.whenReady');
    expect(mainContent).toContain('startServer');
  });

  test('should have application icons', () => {
    const iconPng = path.join(__dirname, '..', 'assets', 'icon.png');
    const iconIco = path.join(__dirname, '..', 'assets', 'icon.ico');
    
    expect(fs.existsSync(iconPng)).toBe(true);
    expect(fs.existsSync(iconIco)).toBe(true);
  });

  test('should have electron-builder configuration', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.build).toBeDefined();
    expect(packageJson.build.appId).toBe('com.archeng.nexus');
    expect(packageJson.build.productName).toBe('ArchEng Nexus');
    expect(packageJson.build.win).toBeDefined();
    expect(packageJson.build.win.target).toBe('nsis');
  });
});