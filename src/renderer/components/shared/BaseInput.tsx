import { Input, InputProps, InputRef } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { OTPProps, OTPRef } from 'antd/es/input/OTP';
import { forwardRef, memo } from 'react';

interface IInputProps extends InputProps {}

export const BaseInput = memo(
  forwardRef<InputRef, IInputProps>(({ type, ...otherProps }, ref) => {
    if (type === 'search') return <Input.Search ref={ref} {...otherProps} />;
    if (type === 'password')
      return <Input.Password ref={ref} {...otherProps} />;

    return <Input ref={ref} {...otherProps} />;
  }),
);

interface IOTPProps extends OTPProps {}

export const BaseInputOTP = memo(
  forwardRef<OTPRef, IOTPProps>(({ ...otherProps }, ref) => {
    return <Input.OTP ref={ref} {...otherProps} />;
  }),
);

interface ITextAreaProps extends TextAreaProps {}

export const BaseTextArea = memo(
  forwardRef<InputRef, ITextAreaProps>(({ ...otherProps }, ref) => {
    return <Input.TextArea ref={ref} {...otherProps} />;
  }),
);

BaseInput.displayName = 'BaseInput';
BaseInputOTP.displayName = 'BaseInputOTP';
BaseTextArea.displayName = 'BaseTextArea';
