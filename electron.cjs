const { app, BrowserWindow, Menu, net, protocol, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true }
}]);

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) app.quit();

let mainWindow;
const developmentUrl = 'http://localhost:5173';
const isDevelopment = process.argv.includes('--dev');
const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";

async function registerAppProtocol() {
  const root = path.resolve(app.getAppPath(), 'dist');
  protocol.handle('app', async request => {
    try {
      const url = new URL(request.url);
      if (url.host !== 'station' || !['GET', 'HEAD'].includes(request.method)) return new Response('Not found', { status: 404 });
      const decoded = decodeURIComponent(url.pathname || '/');
      const relative = decoded.replace(/^[/\\]+/, '') || 'index.html';
      const target = path.resolve(root, relative);
      const check = path.relative(root, target);
      if (!check || check.startsWith('..') || path.isAbsolute(check)) {
        if (check === '') return net.fetch(pathToFileURL(path.join(root, 'index.html')).toString());
        return new Response('Forbidden', { status: 403 });
      }
      const result = await net.fetch(pathToFileURL(target).toString());
      const headers = new Headers(result.headers);
      headers.set('Content-Security-Policy', contentSecurityPolicy);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'no-referrer');
      return new Response(request.method === 'HEAD' ? null : result.body, { status: result.status, headers });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 760, minHeight: 620,
    backgroundColor: '#101a28', title: 'Mistério na Estação',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  mainWindow = win;
  win.removeMenu();
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    const allowed = isDevelopment ? url.startsWith(developmentUrl) : url.startsWith('app://station/');
    if (!allowed) event.preventDefault();
  });
  win.webContents.on('will-redirect', (event, url) => {
    const allowed = isDevelopment ? url.startsWith(developmentUrl) : url.startsWith('app://station/');
    if (!allowed) event.preventDefault();
  });
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      event.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
  });
  void win.loadURL(isDevelopment ? developmentUrl : 'app://station/');
  return win;
}

if (hasSingleInstance) {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
  app.whenReady().then(async () => {
    await registerAppProtocol();
    const currentSession = session.defaultSession;
    currentSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    currentSession.setPermissionCheckHandler(() => false);
    Menu.setApplicationMenu(null);
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
