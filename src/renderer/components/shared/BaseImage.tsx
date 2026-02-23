import type { ImageProps } from 'antd/es/image';

import { Image } from 'antd';
import { memo, useCallback, useState } from 'react';

interface IImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export const BaseImage: React.FC<IImageProps> = memo(
  ({
    fallback = FALLBACK_IMAGE,
    loading = 'lazy',
    onError,
    preview = false,
    src,
    ...otherProps
  }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(event);
      },
      [onError],
    );

    return (
      <Image
        fallback={fallback}
        loading={loading}
        onError={handleError}
        preview={hasError ? false : preview}
        src={src}
        {...otherProps}
      />
    );
  },
);

interface IPreviewGroupProps
  extends React.ComponentProps<typeof Image.PreviewGroup> {}

export const BaseImagePreviewGroup: React.FC<IPreviewGroupProps> = memo(
  ({ children, ...otherProps }) => {
    return <Image.PreviewGroup {...otherProps}>{children}</Image.PreviewGroup>;
  },
);

const FALLBACK_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#F5F5F5"/>
    <g transform="translate(70, 60)">
      <rect x="4" y="4" width="52" height="52" rx="4" stroke="#BDBDBD" stroke-width="3" fill="none"/>
      <circle cx="20" cy="20" r="5" fill="#BDBDBD"/>
      <path d="M56 40L44 28L32 40L24 32L4 52" stroke="#BDBDBD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line x1="2" y1="2" x2="58" y2="58" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
    </g>
    <text x="100" y="150" text-anchor="middle" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Image unavailable</text>
  </svg>`);

BaseImage.displayName = 'BaseImage';
BaseImagePreviewGroup.displayName = 'BaseImagePreviewGroup';
