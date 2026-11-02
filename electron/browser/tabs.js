'use strict';
const { WebContentsView, session } = require('electron');
const { resolveInput, isNavigable, HOME_URL } = require('./url');

const PARTITION = 'persist:browse';

class TabManager {
  constructor(win) {
    this.win = win;
    this.tabs = new Map(); // id -> { view, title, url, loading }
    this.activeId = null;
    this.nextId = 1;
    this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    // Webpages get no device/notification/etc. permissions in Milestone 1.
    session.fromPartition(PARTITION).setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  }

  create(input) {
    const id = this.nextId++;
    const view = new WebContentsView({
      webPreferences: {
        partition: PARTITION,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
    });
    const tab = { view, title: 'New tab', url: '', loading: false };
    this.tabs.set(id, tab);
    this.win.contentView.addChildView(view);
    this._wire(id, tab);
    this.activate(id);
    view.webContents.loadURL(resolveInput(input) || HOME_URL).catch(() => {});
    return id;
  }

  _wire(id, tab) {
    const wc = tab.view.webContents;
    const sync = () => {
      tab.url = wc.getURL();
      this._emit();
    };
    wc.on('page-title-updated', (_e, title) => { tab.title = title; this._emit(); });
    wc.on('did-navigate', sync);
    wc.on('did-navigate-in-page', sync);
    wc.on('did-start-loading', () => { tab.loading = true; this._emit(); });
    wc.on('did-stop-loading', () => { tab.loading = false; sync(); });
    wc.on('render-process-gone', () => { tab.title = 'Page crashed'; tab.loading = false; this._emit(); });
    wc.on('will-navigate', (e, url) => { if (!isNavigable(url)) e.preventDefault(); });
    wc.setWindowOpenHandler(({ url }) => {
      if (isNavigable(url)) this.create(url);
      return { action: 'deny' };
    });
  }

  activate(id) {
    if (!this.tabs.has(id)) return;
    this.activeId = id;
    for (const [tid, t] of this.tabs) t.view.setVisible(tid === id);
    this.tabs.get(id).view.setBounds(this.bounds);
    this._emit();
  }

  close(id) {
    const tab = this.tabs.get(id);
    if (!tab) return;
    const ids = [...this.tabs.keys()];
    const idx = ids.indexOf(id);
    this.win.contentView.removeChildView(tab.view);
    tab.view.webContents.close();
    this.tabs.delete(id);
    if (this.tabs.size === 0) return void this.create(HOME_URL);
    if (this.activeId === id) {
      const remaining = [...this.tabs.keys()];
      this.activate(remaining[Math.min(idx, remaining.length - 1)]);
    } else this._emit();
  }

  navigate(id, input) {
    const url = resolveInput(input);
    if (url && this.tabs.has(id)) this.tabs.get(id).view.webContents.loadURL(url).catch(() => {});
  }

  _wc(id) { return this.tabs.get(id)?.view.webContents; }
  back(id) { const w = this._wc(id); if (w?.navigationHistory.canGoBack()) w.navigationHistory.goBack(); }
  forward(id) { const w = this._wc(id); if (w?.navigationHistory.canGoForward()) w.navigationHistory.goForward(); }
  reload(id) { this._wc(id)?.reload(); }
  stop(id) { this._wc(id)?.stop(); }

  setBounds(b) {
    this.bounds = b;
    const active = this.tabs.get(this.activeId);
    if (active) active.view.setBounds(b);
  }

  state() {
    return {
      activeId: this.activeId,
      tabs: [...this.tabs].map(([id, t]) => {
        const h = t.view.webContents.navigationHistory;
        return { id, title: t.title, url: t.url, loading: t.loading, canGoBack: h.canGoBack(), canGoForward: h.canGoForward() };
      }),
    };
  }

  _emit() {
    if (!this.win.isDestroyed()) this.win.webContents.send('tabs:state', this.state());
  }
}

module.exports = { TabManager };
