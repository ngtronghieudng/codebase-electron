import type { ImageProps } from 'antd/es/image';

import { Image } from 'antd';

import { useImageImport } from '@/renderer/hooks/shared/use-image-import';

interface IProps extends ImageProps {}

export const BaseImage: React.FC<IProps> = ({
  loading = 'lazy',
  preview = false,
  src = '',
  ...otherProps
}) => {
  const isLazy = loading === 'lazy';
  const isExternalUrl = src.startsWith('http');

  const assetImageSrc = useImageImport(src, isLazy) || src;
  const imageSrc = isExternalUrl ? src : assetImageSrc;

  return (
    <Image loading={loading} preview={preview} src={imageSrc} {...otherProps} />
  );
};
