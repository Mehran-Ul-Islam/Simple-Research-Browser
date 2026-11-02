import React, { useState } from 'react';
import TabStrip from './components/TabStrip.jsx';
import Toolbar from './components/Toolbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import WebArea from './browser/WebArea.jsx';
import { useTabs } from './browser/useTabs.js';

export default function App() {
  const { tabs, activeId, active, api } = useTabs();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  if (!api) return <p className="fatal">This UI must run inside the Electron shell.</p>;

  return (
    <div className="app">
      <TabStrip tabs={tabs} activeId={activeId} api={api} />
      <Toolbar
        active={active} api={api}
        leftOpen={leftOpen} rightOpen={rightOpen}
        onToggleLeft={() => setLeftOpen((v) => !v)}
        onToggleRight={() => setRightOpen((v) => !v)}
      />
      <div className="body">
        <Sidebar side="left" open={leftOpen} title="Research">
          <p className="muted">Workspaces, bookmarks, history and saved pages are not built yet.</p>
        </Sidebar>
        <WebArea api={api} />
        <Sidebar side="right" open={rightOpen} title="Perplexity">
          <p className="status"><span className="dot off" /> Not configured</p>
          <p className="muted">The assistant arrives in Milestone 2. No API key is stored or required yet.</p>
        </Sidebar>
      </div>
    </div>
  );
}
