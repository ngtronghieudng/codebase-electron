import { Modal, ModalProps } from 'antd';
import { memo } from 'react';

interface IProps extends ModalProps {}

export const BaseModal: React.FC<IProps> = memo(
  ({ children, ...otherProps }) => {
    return <Modal {...otherProps}>{children}</Modal>;
  },
);

BaseModal.displayName = 'BaseModal';
