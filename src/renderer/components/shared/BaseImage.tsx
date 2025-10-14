import type { ImageProps } from 'antd/es/image';

import { Image } from 'antd';

interface IProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export const BaseImage: React.FC<IProps> = ({
  loading = 'lazy',
  preview = false,
  src,
  ...otherProps
}) => {
  return (
    <Image loading={loading} preview={preview} src={src} {...otherProps} />
  );
};
