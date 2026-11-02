import React, { useEffect, useRef } from 'react';

// The page itself is a native Chromium view owned by the main process.
// This element only reserves the space and reports its bounds.
export default function WebArea({ api }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!api || !ref.current) return undefined;
    const send = () => {
      const r = ref.current.getBoundingClientRect();
      api.setBounds({ x: r.x, y: r.y, width: Math.max(0, r.width), height: Math.max(0, r.height) });
    };
    const ro = new ResizeObserver(send);
    ro.observe(ref.current);
    send();
    return () => ro.disconnect();
  }, [api]);
  return <main className="web-area" ref={ref} aria-label="Web page" />;
}
