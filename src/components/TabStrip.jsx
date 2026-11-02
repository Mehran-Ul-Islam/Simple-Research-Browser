import React from 'react';

export default function TabStrip({ tabs, activeId, api }) {
  return (
    <div className="tabstrip" role="tablist">
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tab"
          aria-selected={t.id === activeId}
          className={`tab${t.id === activeId ? ' active' : ''}`}
          onClick={() => api.activate(t.id)}
          onAuxClick={(e) => e.button === 1 && api.close(t.id)}
          title={t.title}
        >
          <span className="tab-title">{t.loading ? 'Loading…' : t.title || 'New tab'}</span>
          <button className="icon-btn" aria-label={`Close ${t.title}`} onClick={(e) => { e.stopPropagation(); api.close(t.id); }}>×</button>
        </div>
      ))}
      <button className="icon-btn new-tab" aria-label="New tab" onClick={() => api.create()}>+</button>
    </div>
  );
}
