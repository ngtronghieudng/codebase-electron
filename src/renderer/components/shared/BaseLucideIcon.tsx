import type { LucideIcon, LucideProps } from 'lucide-react';

import { forwardRef, memo } from 'react';

import { cn } from '@/shared/utils/shared.util';

interface IProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

export const BaseLucideIcon = memo(
  forwardRef<SVGSVGElement, IProps>(
    ({ className, icon: IconComponent, size = 20, ...otherProps }, ref) => {
      return (
        <IconComponent
          className={cn('anticon', className)}
          ref={ref}
          size={size}
          {...otherProps}
        />
      );
    },
  ),
);

BaseLucideIcon.displayName = 'BaseLucideIcon';
