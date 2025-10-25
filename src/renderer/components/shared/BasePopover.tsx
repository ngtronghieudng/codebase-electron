import { Popover, PopoverProps } from 'antd';
import { memo } from 'react';

interface IProps extends PopoverProps {}

export const BasePopover: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Popover {...otherProps}>{children}</Popover>;
  },
);

BasePopover.displayName = 'BasePopover';
