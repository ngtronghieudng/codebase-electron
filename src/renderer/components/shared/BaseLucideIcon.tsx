import type { LucideIcon, LucideProps } from 'lucide-react';

import { forwardRef, memo } from 'react';

interface IProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

export const BaseLucideIcon = memo(
  forwardRef<SVGSVGElement, IProps>(
    ({ icon: IconComponent, size = 20, ...otherProps }, ref) => {
      return <IconComponent ref={ref} size={size} {...otherProps} />;
    },
  ),
);

BaseLucideIcon.displayName = 'BaseLucideIcon';
