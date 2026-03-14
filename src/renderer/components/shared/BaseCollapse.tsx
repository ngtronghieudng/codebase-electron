import { Collapse, CollapseProps } from 'antd';
import { memo } from 'react';

interface IProps extends CollapseProps {}

export const BaseCollapse: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Collapse {...otherProps} />;
});

BaseCollapse.displayName = 'BaseCollapse';
