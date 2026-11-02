'use strict';
const { contextBridge, ipcRenderer } = require('electron');

const call = (channel) => (...args) => ipcRenderer.invoke(channel, ...args);

contextBridge.exposeInMainWorld('browserApi', {
  tabs: {
    create: call('tabs:create'),
    close: call('tabs:close'),
    activate: call('tabs:activate'),
    navigate: call('tabs:navigate'),
    back: call('tabs:back'),
    forward: call('tabs:forward'),
    reload: call('tabs:reload'),
    stop: call('tabs:stop'),
    setBounds: call('tabs:setBounds'),
    getState: call('tabs:state'),
    onState(cb) {
      const handler = (_e, state) => cb(state);
      ipcRenderer.on('tabs:state', handler);
      return () => ipcRenderer.removeListener('tabs:state', handler);
    },
  },
});
