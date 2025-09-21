import { RefSelectProps, Select, SelectProps } from 'antd';
import { forwardRef } from 'react';

interface IProps extends SelectProps {}

export const BaseSelect = forwardRef<RefSelectProps, IProps>(
  ({ ...otherProps }, ref) => {
    return <Select ref={ref} {...otherProps} />;
  },
);

BaseSelect.displayName = 'BaseSelect';
