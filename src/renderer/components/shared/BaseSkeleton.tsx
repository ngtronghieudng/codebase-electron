import { Skeleton, SkeletonProps } from 'antd';
import { AvatarProps } from 'antd/es/skeleton/Avatar';
import { SkeletonButtonProps } from 'antd/es/skeleton/Button';
import { SkeletonImageProps } from 'antd/es/skeleton/Image';
import { SkeletonInputProps } from 'antd/es/skeleton/Input';
import { SkeletonNodeProps } from 'antd/es/skeleton/Node';
import { memo } from 'react';

interface ISkeletonProps extends SkeletonProps {}

export const BaseSkeleton: React.FC<ISkeletonProps> = memo(
  ({ ...otherProps }) => {
    return <Skeleton {...otherProps} />;
  },
);

interface ISkeletonAvatarProps extends AvatarProps {}

export const BaseSkeletonAvatar: React.FC<ISkeletonAvatarProps> = memo(
  ({ ...otherProps }) => {
    return <Skeleton.Avatar {...otherProps} />;
  },
);

interface ISkeletonButtonProps extends SkeletonButtonProps {}

export const BaseSkeletonButton: React.FC<ISkeletonButtonProps> = memo(
  ({ ...otherProps }) => {
    return <Skeleton.Button {...otherProps} />;
  },
);

interface ISkeletonImageProps extends SkeletonImageProps {}

export const BaseSkeletonImage: React.FC<ISkeletonImageProps> = memo(
  ({ ...otherProps }) => {
    return <Skeleton.Image {...otherProps} />;
  },
);

interface ISkeletonInputProps extends SkeletonInputProps {}

export const BaseSkeletonInput: React.FC<ISkeletonInputProps> = memo(
  ({ ...otherProps }) => {
    return <Skeleton.Input {...otherProps} />;
  },
);

interface ISkeletonNodeProps extends SkeletonNodeProps {}

export const BaseSkeletonNode: React.FC<ISkeletonNodeProps> = memo(
  ({ children, ...otherProps }) => {
    return <Skeleton.Node {...otherProps}>{children}</Skeleton.Node>;
  },
);

BaseSkeleton.displayName = 'BaseSkeleton';
BaseSkeletonAvatar.displayName = 'BaseSkeletonAvatar';
BaseSkeletonButton.displayName = 'BaseSkeletonButton';
BaseSkeletonImage.displayName = 'BaseSkeletonImage';
BaseSkeletonInput.displayName = 'BaseSkeletonInput';
BaseSkeletonNode.displayName = 'BaseSkeletonNode';
