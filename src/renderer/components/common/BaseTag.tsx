import { Tag, TagProps } from 'antd';
import { memo } from 'react';

interface IProps extends TagProps {}

export const BaseTag: React.FC<IProps> = memo(({ children, ...otherProps }) => {
  return <Tag {...otherProps}>{children}</Tag>;
});

BaseTag.displayName = 'BaseTag';
