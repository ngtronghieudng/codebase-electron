import { Checkbox, CheckboxProps, CheckboxRef } from 'antd';
import { forwardRef, memo } from 'react';

interface IProps extends CheckboxProps {}

export const BaseCheckbox = memo(
  forwardRef<CheckboxRef, IProps>(({ children, ...otherProps }, ref) => {
    return (
      <Checkbox ref={ref} {...otherProps}>
        {children}
      </Checkbox>
    );
  }),
);

BaseCheckbox.displayName = 'BaseCheckbox';
