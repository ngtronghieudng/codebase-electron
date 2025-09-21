import { useEffect, useState } from 'react';

export const useWindowScroll = () => {
  const [scroll, setScroll] = useState({
    x: 0,
    y: 0,
  });

  const handleScroll = () => {
    setScroll({ x: window.scrollX, y: window.scrollY });
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
};
