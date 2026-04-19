import { Popover, PopoverProps } from 'antd';
import { CSSProperties, memo, useMemo } from 'react';

import { BORDER_RADIUS } from '@/renderer/definitions/constants/style-variables.const';

interface IProps extends PopoverProps {}

export const BasePopover: React.FC<IProps> = memo(
  ({ children, styles, ...otherProps }) => {
    const mergedStyles = useMemo(
      () => ({
        ...styles,
        root: { ...DEFAULT_ROOT_STYLE, ...styles?.root },
      }),
      [styles],
    );

    return (
      <Popover styles={mergedStyles} {...otherProps}>
        {children}
      </Popover>
    );
  },
);

const DEFAULT_ROOT_STYLE: CSSProperties = {
  border: '1px solid var(--theme-border-color)',
  borderRadius: BORDER_RADIUS.POPOVER,
};

BasePopover.displayName = 'BasePopover';
