import { Steps, StepsProps } from 'antd';
import { memo } from 'react';

interface IProps extends StepsProps {}

export const BaseSteps: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Steps {...otherProps} />;
});

BaseSteps.displayName = 'BaseSteps';
