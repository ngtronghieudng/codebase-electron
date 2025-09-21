import { Input, InputProps, InputRef } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { OTPProps, OTPRef } from 'antd/es/input/OTP';
import { forwardRef } from 'react';

interface IInputProps extends InputProps {}
interface IOTPProps extends OTPProps {}
interface ITextAreaProps extends TextAreaProps {}

export const BaseInput = forwardRef<InputRef, IInputProps>(
  ({ type, ...otherProps }, ref) => {
    if (type === 'search') return <Input.Search ref={ref} {...otherProps} />;
    if (type === 'password')
      return <Input.Password ref={ref} {...otherProps} />;

    return <Input ref={ref} {...otherProps} />;
  },
);

export const BaseInputOTP = forwardRef<OTPRef, IOTPProps>(
  ({ ...otherProps }, ref) => {
    return <Input.OTP ref={ref} {...otherProps} />;
  },
);

export const BaseTextArea = forwardRef<InputRef, ITextAreaProps>(
  ({ ...otherProps }, ref) => {
    return <Input.TextArea ref={ref} {...otherProps} />;
  },
);

BaseInput.displayName = 'BaseInput';
BaseInputOTP.displayName = 'BaseInputOTP';
BaseTextArea.displayName = 'BaseTextArea';
