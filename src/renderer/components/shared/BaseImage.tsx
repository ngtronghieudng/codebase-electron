import type { ImageProps } from 'antd/es/image';

import { Image } from 'antd';

import { useDynamicImport } from '@/renderer/hooks/shared/use-dynamic-import';

interface IProps extends ImageProps {}

export const BaseImage: React.FC<IProps> = ({
  loading = 'lazy',
  preview = false,
  src = '',
  ...otherProps
}) => {
  const isLazy = loading === 'lazy';
  const imageSrc = useDynamicImport(src, isLazy) || src;

  return (
    <Image loading={loading} preview={preview} src={imageSrc} {...otherProps} />
  );
};
