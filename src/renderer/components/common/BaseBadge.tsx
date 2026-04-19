import { Badge, BadgeProps } from 'antd';
import { memo } from 'react';

interface IProps extends BadgeProps {}

export const BaseBadge: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Badge {...otherProps}>{children}</Badge>;
  },
);

BaseBadge.displayName = 'BaseBadge';
