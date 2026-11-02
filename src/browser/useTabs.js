import { useEffect, useState } from 'react';

const api = window.browserApi?.tabs;

export function useTabs() {
  const [state, setState] = useState({ tabs: [], activeId: null });
  useEffect(() => {
    if (!api) return undefined;
    api.getState().then(setState);
    return api.onState(setState);
  }, []);
  const active = state.tabs.find((t) => t.id === state.activeId) || null;
  return { ...state, active, api };
}
