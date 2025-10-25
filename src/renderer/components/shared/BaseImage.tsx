import type { ImageProps } from 'antd/es/image';

import { Image } from 'antd';
import { memo } from 'react';

interface IProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export const BaseImage: React.FC<IProps> = memo(
  ({ loading = 'lazy', preview = false, src, ...otherProps }) => {
    return (
      <Image loading={loading} preview={preview} src={src} {...otherProps} />
    );
  },
);

BaseImage.displayName = 'BaseImage';
