import { Dropdown, DropdownProps } from 'antd';
import { memo } from 'react';

interface IProps extends DropdownProps {}

export const BaseDropdown: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Dropdown {...otherProps}>{children}</Dropdown>;
  },
);

BaseDropdown.displayName = 'BaseDropdown';
