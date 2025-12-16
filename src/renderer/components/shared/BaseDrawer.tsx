import { Drawer, DrawerProps } from 'antd';
import { memo } from 'react';

interface IProps extends DrawerProps {}

export const BaseDrawer: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Drawer {...otherProps}>{children}</Drawer>;
  },
);

BaseDrawer.displayName = 'BaseDrawer';
