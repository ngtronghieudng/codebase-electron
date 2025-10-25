import { DatePicker, DatePickerProps } from 'antd';
import { MonthPickerProps } from 'antd/es/date-picker';
import { memo } from 'react';

interface IDatePickerProps extends DatePickerProps {}
interface IMonthPickerProps extends MonthPickerProps {}

export const BaseDatePicker: React.FC<IDatePickerProps> = memo(
  ({ ...otherProps }) => {
    return <DatePicker {...otherProps} />;
  },
);

export const BaseMonthPicker: React.FC<IMonthPickerProps> = memo(
  ({ ...otherProps }) => {
    return <DatePicker.MonthPicker {...otherProps} />;
  },
);

BaseDatePicker.displayName = 'BaseDatePicker';
BaseMonthPicker.displayName = 'BaseMonthPicker';
