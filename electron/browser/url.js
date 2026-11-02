'use strict';
const SEARCH_URL = 'https://www.google.com/search?q=';
const HOME_URL = 'https://www.google.com/';

const HOST = /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([/?#].*)?$/i;
const LOCAL = /^(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?([/?#].*)?$/i;

function isNavigable(url) {
  try {
    const p = new URL(url).protocol;
    return p === 'http:' || p === 'https:';
  } catch {
    return false;
  }
}

/** Turn address-bar text into a URL to load (never a non-http(s) URL). */
function resolveInput(raw) {
  const s = String(raw ?? '').trim().slice(0, 2048);
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return isNavigable(s) ? s : null;
  if (!/\s/.test(s)) {
    if (LOCAL.test(s)) return `http://${s}`;
    if (HOST.test(s)) return `https://${s}`;
  }
  return SEARCH_URL + encodeURIComponent(s);
}

module.exports = { SEARCH_URL, HOME_URL, resolveInput, isNavigable };
