import React from 'react';

// Shared collapsible shell. Collapsing removes the panel so the page area reclaims the space.
export default function Sidebar({ side, open, title, children }) {
  if (!open) return null;
  return (
    <aside className={`sidebar ${side}`} aria-label={title}>
      <header className="sidebar-head">{title}</header>
      <div className="sidebar-body">{children}</div>
    </aside>
  );
}
