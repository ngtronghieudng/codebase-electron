import { InputNumber, InputNumberProps } from 'antd';
import { memo } from 'react';

interface IProps extends InputNumberProps {}

export const BaseInputNumber: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <InputNumber {...otherProps}>{children}</InputNumber>;
  },
);

BaseInputNumber.displayName = 'BaseInputNumber';
