import { AutoComplete, AutoCompleteProps } from 'antd';
import { memo } from 'react';

interface IProps extends AutoCompleteProps {}

export const BaseAutocomplete: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <AutoComplete {...otherProps} />;
});

BaseAutocomplete.displayName = 'BaseAutocomplete';
