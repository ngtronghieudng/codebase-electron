import { XCircle } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import styles from '@/layouts/ErrorLayout.module.scss';
import { BaseButton } from '@/renderer/components/common/BaseButton';
import { BaseLucideIcon } from '@/renderer/components/common/BaseLucideIcon';
import { HOME_PAGE } from '@/renderer/definitions/constants/route-pages.const';

type TProps = Partial<FallbackProps> & {
  variant?: 'forbidden' | 'notFound';
};

export const ErrorLayout: React.FC<TProps> = ({
  resetErrorBoundary,
  variant,
}) => {
  const { t } = useTranslation();

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    window.location.href = HOME_PAGE;
  };

  const title =
    variant === 'forbidden'
      ? t('errors.forbidden')
      : variant === 'notFound'
        ? t('errors.pageNotFound')
        : t('errors.somethingWentWrong');
  const description =
    variant === 'forbidden'
      ? t('errors.forbiddenDescription')
      : variant === 'notFound'
        ? t('errors.pageNotFoundDescription')
        : t('errors.description');

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPageContainer}>
        <div className={styles.errorPageIconWrapper}>
          <BaseLucideIcon
            className={styles.errorPageIcon}
            icon={XCircle}
            strokeWidth={2}
          />
        </div>

        <p className={styles.errorPageCode}>{t('errors.code')}</p>
        <h1 className={styles.errorPageTitle}>{title}</h1>
        <p className={styles.errorPageDescription}>{description}</p>

        <div className={styles.errorPageActions}>
          <BaseButton onClick={handleRetry} type="primary">
            {t('errors.tryAgain')}
          </BaseButton>
          <BaseButton onClick={handleGoBack} type="default">
            {t('errors.goBack')}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};
