import { Tabs, TabsProps } from 'antd';
import { memo } from 'react';

interface IProps extends TabsProps {}

export const BaseTabs: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Tabs {...otherProps} />;
});

BaseTabs.displayName = 'BaseTabs';
