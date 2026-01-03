import { XCircle } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import styles from '@/renderer/assets/styles/components/shared/error-layout.module.scss';
import { BaseButton } from '@/renderer/components/shared/BaseButton';
import { BaseLucideIcon } from '@/renderer/components/shared/BaseLucideIcon';
import { HOME_PAGE } from '@/shared/definitions/constants/route-pages.const';

type TProps = Partial<FallbackProps>;

export const ErrorLayout: React.FC<TProps> = ({ resetErrorBoundary }) => {
  const { t } = useTranslation();

  const handleRetry = () => {
    if (resetErrorBoundary) resetErrorBoundary();
    else window.location.reload();
  };

  const handleGoBack = () => {
    window.location.href = HOME_PAGE;
  };

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
        <h1 className={styles.errorPageTitle}>
          {t('errors.somethingWentWrong')}
        </h1>
        <p className={styles.errorPageDescription}>{t('errors.description')}</p>

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
