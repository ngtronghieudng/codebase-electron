import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface IProps {
  cancelButtonText?: string;
  confirmButtonText?: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}

export const useConfirmModal = () => {
  const { t } = useTranslation();

  const showConfirmModal = async ({
    cancelButtonText = t('shared.button.cancel'),
    confirmButtonText = t('shared.button.ok'),
    content,
    onCancel,
    onConfirm,
    title,
  }: IProps) => {
    Modal.confirm({
      cancelText: cancelButtonText,
      centered: true,
      content,
      maskClosable: false,
      okText: confirmButtonText,
      onCancel: onCancel,
      onOk: onConfirm,
      title,
    });
  };

  return { showConfirmModal };
};
