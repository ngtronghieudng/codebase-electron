import { Upload, UploadProps } from 'antd';
import { memo } from 'react';

interface IProps extends UploadProps {}

export const BaseUpload: React.FC<IProps> = memo(({ ...otherProps }) => {
  return <Upload {...otherProps} />;
});

BaseUpload.displayName = 'BaseUpload';
