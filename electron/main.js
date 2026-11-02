'use strict';
const path = require('node:path');
const { app, BrowserWindow } = require('electron');
const { TabManager } = require('./browser/tabs');
const { handle, isId, isText, isRect } = require('./security/ipc');
const { HOME_URL } = require('./browser/url');

const DEV_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#14161a',
    title: 'Research Browser',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // The app shell may never navigate away or open windows.
  const appOrigin = DEV_URL ? new URL(DEV_URL).origin : 'file://';
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(appOrigin)) e.preventDefault(); });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  const tabs = new TabManager(win);
  const none = () => true;
  handle(win, 'tabs:create', (u) => u === undefined || isText(u), (u) => tabs.create(u));
  handle(win, 'tabs:close', isId, (id) => tabs.close(id));
  handle(win, 'tabs:activate', isId, (id) => tabs.activate(id));
  handle(win, 'tabs:navigate', (id, t) => isId(id) && isText(t), (id, t) => tabs.navigate(id, t));
  handle(win, 'tabs:back', isId, (id) => tabs.back(id));
  handle(win, 'tabs:forward', isId, (id) => tabs.forward(id));
  handle(win, 'tabs:reload', isId, (id) => tabs.reload(id));
  handle(win, 'tabs:stop', isId, (id) => tabs.stop(id));
  handle(win, 'tabs:setBounds', isRect, (b) => tabs.setBounds({
    x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height),
  }));
  handle(win, 'tabs:state', none, () => tabs.state());

  win.webContents.once('did-finish-load', () => tabs.create(HOME_URL));
  if (DEV_URL) win.loadURL(DEV_URL);
  else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
