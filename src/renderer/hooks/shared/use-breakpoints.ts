import { useWindowSize } from 'usehooks-ts';

import { BREAKPOINTS } from '@/shared/definitions/constants/shared.const';

export const useBreakpoints = () => {
  const { width } = useWindowSize();

  const isMobile = width ? width < BREAKPOINTS.MOBILE : false;
  const isTablet = width
    ? width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET
    : false;
  const isDesktop = width ? width >= BREAKPOINTS.TABLET : false;

  return {
    isDesktop,
    isMobile,
    isTablet,
    screenWidth: width,
  };
};
