import { DatePicker, DatePickerProps } from 'antd';
import { memo } from 'react';

interface IDatePickerProps extends DatePickerProps {}

export const BaseDatePicker: React.FC<IDatePickerProps> = memo(
  ({ ...otherProps }) => {
    return <DatePicker {...otherProps} />;
  },
);

interface IMonthPickerProps extends Omit<DatePickerProps, 'picker'> {}

export const BaseMonthPicker: React.FC<IMonthPickerProps> = memo(
  ({ ...otherProps }) => {
    return <DatePicker picker="month" {...otherProps} />;
  },
);

BaseDatePicker.displayName = 'BaseDatePicker';
BaseMonthPicker.displayName = 'BaseMonthPicker';
