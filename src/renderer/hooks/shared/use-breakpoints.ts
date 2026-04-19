import { useWindowSize } from 'usehooks-ts';

import { BREAKPOINTS } from '@/renderer/definitions/constants/shared.const';

export const useBreakpoints = () => {
  const { width } = useWindowSize();

  const isTablet = width >= BREAKPOINTS.MD && width < BREAKPOINTS.LG;
  const isLaptop = width >= BREAKPOINTS.LG && width < BREAKPOINTS.XL;
  const isMobileDown = width < BREAKPOINTS.MD;
  const isDesktopUp = width >= BREAKPOINTS.XL;
  const isLaptopUp = width >= BREAKPOINTS.LG;

  return {
    isDesktopUp,
    isLaptop,
    isLaptopUp,
    isMobileDown,
    isTablet,
    screenWidth: width,
  };
};
