import { Modal, ModalProps } from 'antd';
import { CSSProperties, memo, useMemo } from 'react';

import { BORDER_RADIUS } from '@/shared/definitions/constants/style-variables.const';

interface IProps extends ModalProps {}

export const BaseModal: React.FC<IProps> = memo(
  ({ children, styles, ...otherProps }) => {
    const mergedStyles = useMemo(
      () => ({
        ...styles,
        content: { ...DEFAULT_CONTENT_STYLE, ...styles?.content },
        mask: { ...DEFAULT_MASK_STYLE, ...styles?.mask },
      }),
      [styles],
    );

    return (
      <Modal styles={mergedStyles} {...otherProps}>
        {children}
      </Modal>
    );
  },
);

const DEFAULT_CONTENT_STYLE: CSSProperties = {
  border: '1px solid var(--theme-border-color)',
  borderRadius: BORDER_RADIUS.MODAL,
};

const DEFAULT_MASK_STYLE: CSSProperties = {
  backdropFilter: 'blur(8px)',
  background: 'rgba(0, 0, 0, 0.4)',
};

BaseModal.displayName = 'BaseModal';
