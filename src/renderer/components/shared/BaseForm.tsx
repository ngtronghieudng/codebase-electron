import { Form, FormProps } from 'antd';
import { memo } from 'react';

interface IProps extends Omit<FormProps, 'children'> {
  children?: React.ReactNode;
}

export const BaseForm: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Form {...otherProps}>{children}</Form>;
  },
);

export const useBaseForm: typeof Form.useForm = Form.useForm;
export const useBaseFormWatch: typeof Form.useWatch = Form.useWatch;

BaseForm.displayName = 'BaseForm';
