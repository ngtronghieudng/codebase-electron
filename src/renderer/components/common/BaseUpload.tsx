import { DraggerProps, Upload, UploadProps } from 'antd';
import { memo } from 'react';

interface IUploadProps extends UploadProps {}

export const BaseUpload: React.FC<IUploadProps> = memo(({ ...otherProps }) => {
  return <Upload {...otherProps} />;
});

interface IDraggerProps extends DraggerProps {}

export const BaseUploadDragger: React.FC<IDraggerProps> = memo(
  ({ ...otherProps }) => {
    return <Upload.Dragger {...otherProps} />;
  },
);

BaseUpload.displayName = 'BaseUpload';
BaseUploadDragger.displayName = 'BaseUploadDragger';
