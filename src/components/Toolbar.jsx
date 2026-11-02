import React, { useEffect, useRef, useState } from 'react';

export default function Toolbar({ active, api, leftOpen, rightOpen, onToggleLeft, onToggleRight }) {
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const input = useRef(null);

  useEffect(() => { if (!editing) setText(active?.url || ''); }, [active?.url, active?.id, editing]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); input.current?.focus(); input.current?.select(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const id = active?.id;
  const submit = (e) => {
    e.preventDefault();
    if (id) api.navigate(id, text);
    input.current?.blur();
  };

  return (
    <div className="toolbar">
      <button className="icon-btn" aria-pressed={leftOpen} aria-label="Toggle left sidebar" onClick={onToggleLeft}>☰</button>
      <button className="icon-btn" disabled={!active?.canGoBack} aria-label="Back" onClick={() => api.back(id)}>←</button>
      <button className="icon-btn" disabled={!active?.canGoForward} aria-label="Forward" onClick={() => api.forward(id)}>→</button>
      <button className="icon-btn" disabled={!id} aria-label={active?.loading ? 'Stop' : 'Reload'} onClick={() => (active?.loading ? api.stop(id) : api.reload(id))}>
        {active?.loading ? '✕' : '↻'}
      </button>
      <form className="omnibox" onSubmit={submit}>
        <input
          ref={input}
          value={text}
          spellCheck={false}
          placeholder="Search Google or enter an address"
          aria-label="Address and search"
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => { setEditing(true); e.target.select(); }}
          onBlur={() => setEditing(false)}
        />
      </form>
      <button className="icon-btn" aria-pressed={rightOpen} aria-label="Toggle right sidebar" onClick={onToggleRight}>◨</button>
    </div>
  );
}
