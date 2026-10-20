import { useEffect, useState } from 'react';

// The on-screen keyboard shrinks the visual viewport; a gap above this threshold means it is open.
const KEYBOARD_THRESHOLD_PX = 150;

export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => setOpen(window.innerHeight - viewport.height > KEYBOARD_THRESHOLD_PX);
    update();
    viewport.addEventListener('resize', update);
    return () => viewport.removeEventListener('resize', update);
  }, []);

  return open;
}
