import { Switch, SwitchProps } from 'antd';
import { memo } from 'react';

interface IProps extends SwitchProps {}

export const BaseSwitch: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Switch {...otherProps} />;
});

BaseSwitch.displayName = 'BaseSwitch';
