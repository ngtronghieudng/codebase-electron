import { AutoComplete, AutoCompleteProps } from 'antd';
import { memo } from 'react';

interface IProps extends AutoCompleteProps {}

export const BaseAutoComplete: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <AutoComplete {...otherProps} />;
});

BaseAutoComplete.displayName = 'BaseAutoComplete';
