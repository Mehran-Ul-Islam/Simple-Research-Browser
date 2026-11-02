# Research Browser

A desktop browser built for research: Google search, a Perplexity sidebar, session notes, and a real CPython workspace. MIT licensed.

## Status: Milestone 1

| Feature | State |
| --- | --- |
| Electron + React shell, secure IPC | Done |
| Chromium tabs, back/forward/reload/stop | Done |
| Address bar: URL or Google search | Done |
| Collapsible left/right sidebars, dark UI | Done (sidebars hold placeholders) |
| Perplexity sidebar | Not started |
| Session notes | Not started |
| CPython workspace | Not started |
| Bookmarks, history, search suggestions | Not started |

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev      # development with hot reload
npm run start    # build the UI, then launch
npm test         # address-bar URL resolution tests
```

## API Configuration

The app works with no credentials. The Perplexity panel shows **Not configured** until you add a key.

1. **Required:** one Perplexity API key. Nothing else is needed.
2. **Where to get it:** create an account at perplexity.ai, open the API settings page, and generate a key.
3. **How to configure:** a Settings screen with key entry and OS credential-store storage (Windows Credential Manager, macOS Keychain, libsecret) is planned for Milestone 2. It is not implemented yet.
4. **Verify / troubleshoot:** a "Test connection" button and error messages for missing or invalid keys will ship with that Settings screen.

Keys are never read by webpage content or renderer code. Do not commit real keys. `.env.example` has placeholders only.

## Third-party licenses

Electron (MIT), React (MIT), Vite (MIT), @vitejs/plugin-react (MIT). Later milestones add Monaco Editor (MIT) and a bundled CPython (PSF License).
