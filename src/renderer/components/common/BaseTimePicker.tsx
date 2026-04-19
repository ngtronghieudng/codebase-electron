import { TimePicker, TimePickerProps } from 'antd';
import { memo } from 'react';

interface IProps extends TimePickerProps {}

export const BaseTimePicker: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <TimePicker {...otherProps} />;
});

BaseTimePicker.displayName = 'BaseTimePicker';
