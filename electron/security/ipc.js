'use strict';
const { ipcMain } = require('electron');

const isId = (v) => Number.isInteger(v) && v > 0;
const isText = (v) => typeof v === 'string' && v.length <= 2048;
const isRect = (v) =>
  v && ['x', 'y', 'width', 'height'].every((k) => Number.isFinite(v[k]) && v[k] >= 0 && v[k] < 20000);

/** Register an IPC handler that only accepts messages from our own window and validates args. */
function handle(win, channel, validate, fn) {
  ipcMain.handle(channel, (event, ...args) => {
    if (event.sender !== win.webContents) throw new Error('Untrusted sender');
    if (!validate(...args)) throw new Error(`Invalid arguments for ${channel}`);
    return fn(...args);
  });
}

module.exports = { handle, isId, isText, isRect };
