import { Button, ButtonProps } from 'antd';
import { memo } from 'react';

interface IProps extends ButtonProps {}

export const BaseButton: React.FC<IProps> = memo(
  ({ children, type = 'primary', ...otherProps }) => {
    return (
      <Button type={type} {...otherProps}>
        {children}
      </Button>
    );
  },
);

BaseButton.displayName = 'BaseButton';
