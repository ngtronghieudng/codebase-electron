import { Checkbox, CheckboxProps, CheckboxRef } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { forwardRef, memo } from 'react';

import type { TOptions } from '@/shared/definitions/types/shared.type';

interface ICheckboxProps extends CheckboxProps {}

export const BaseCheckbox = memo(
  forwardRef<CheckboxRef, ICheckboxProps>(
    ({ children, ...otherProps }, ref) => {
      return (
        <Checkbox ref={ref} {...otherProps}>
          {children}
        </Checkbox>
      );
    },
  ),
);

interface ICheckboxGroupProps extends Omit<CheckboxGroupProps, 'options'> {
  options: TOptions[];
}

export const BaseCheckboxGroup: React.FC<ICheckboxGroupProps> = memo(
  ({ options, ...otherProps }) => {
    return (
      <Checkbox.Group {...otherProps}>
        {options.map((item, index) => (
          <Checkbox key={item.key || index} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  },
);

BaseCheckbox.displayName = 'BaseCheckbox';
BaseCheckboxGroup.displayName = 'BaseCheckboxGroup';
