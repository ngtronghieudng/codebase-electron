import { RefSelectProps, Select, SelectProps } from 'antd';
import { forwardRef, memo } from 'react';

interface IProps extends SelectProps {}

export const BaseSelect = memo(
  forwardRef<RefSelectProps, IProps>(({ ...otherProps }, ref) => {
    return <Select ref={ref} {...otherProps} />;
  }),
);

BaseSelect.displayName = 'BaseSelect';
