const windowSecurityPreferences = require('../desktop/window-security');

describe('desktop application', () => {
  test('package.json should have electron scripts', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.main).toBe('main.js');
    expect(packageJson.scripts.electron).toBeDefined();
    expect(packageJson.scripts['electron-dev']).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts['build-win']).toBeDefined();
    expect(packageJson.scripts.electron).not.toContain('--no-sandbox');
    expect(packageJson.scripts['electron-dev']).not.toContain('--no-sandbox');
  });

  test('should have required electron dependencies', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.devDependencies.electron).toBeDefined();
    expect(packageJson.devDependencies['electron-builder']).toBeDefined();
  });

  test('main process entry resolves', () => {
    expect(require.resolve('../main.js')).toBeTruthy();
  });

  test('renderer uses least-privilege security preferences', () => {
    expect(windowSecurityPreferences).toEqual({
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    });
  });

  test('package license matches the MIT license file', () => {
    const packageJson = require('../package.json');
    expect(packageJson.license).toBe('MIT');
    expect(require.resolve('../LICENSE')).toBeTruthy();
  });

  test('should have application icons', () => {
    expect(require.resolve('../assets/icon.png')).toBeTruthy();
    expect(require.resolve('../assets/icon.ico')).toBeTruthy();
  });

  test('should have electron-builder configuration', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.build).toBeDefined();
    expect(packageJson.build.appId).toBe('com.archeng.nexus');
    expect(packageJson.build.productName).toBe('ArchEng Nexus');
    expect(packageJson.build.win).toBeDefined();
    expect(packageJson.build.win.target).toBe('nsis');
    expect(packageJson.build.asarUnpack).toEqual([
      'server/**',
      'public/**',
      'node_modules/**',
    ]);
  });
});