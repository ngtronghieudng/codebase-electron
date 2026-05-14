import { Spin, SpinProps } from 'antd';
import { memo } from 'react';

interface IProps extends SpinProps {}

export const BaseSpin: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Spin {...otherProps} />;
});

BaseSpin.displayName = 'BaseSpin';
