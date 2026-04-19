import { Menu, MenuProps } from 'antd';
import { memo } from 'react';

interface IProps extends MenuProps {}

export const BaseMenu: React.FC<IProps> = memo(({ items, ...otherProps }) => {
  return <Menu items={items} {...otherProps} />;
});

BaseMenu.displayName = 'BaseMenu';
