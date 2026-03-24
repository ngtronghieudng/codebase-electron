import { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const useWindowScroll = () => {
  const [scroll, setScroll] = useState({
    x: window.scrollX,
    y: window.scrollY,
  });

  const onResetScroll = () => {
    window.scrollTo(0, 0);
    setScroll({ x: 0, y: 0 });
  };

  const onBackToTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  };

  useEventListener('scroll', () => {
    setScroll({ x: window.scrollX, y: window.scrollY });
  });

  return {
    onBackToTop,
    onResetScroll,
    scroll,
  };
};
