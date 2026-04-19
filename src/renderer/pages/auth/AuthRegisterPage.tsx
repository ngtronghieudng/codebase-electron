import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import IconRequired from '@/renderer/assets/icons/shared/IconRequired.svg?react';
import { BaseButton } from '@/renderer/components/common/BaseButton';
import { BaseForm } from '@/renderer/components/common/BaseForm';
import { BaseFormItem } from '@/renderer/components/common/BaseFormItem';
import { BaseInput } from '@/renderer/components/common/BaseInput';
import { BaseLucideIcon } from '@/renderer/components/common/BaseLucideIcon';
import { AUTH_PAGE } from '@/renderer/definitions/constants/route-pages.const';
import { IAuthRegisterRequest } from '@/renderer/definitions/interfaces/auth.interface';
import { useAuthRegisterMutation } from '@/renderer/hooks/auth/use-auth-mutations';
import { registerSchema } from '@/renderer/schemas/auth.schema';

import styles from './AuthRegisterPage.module.scss';

export const AuthRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const registerForm = useForm<IAuthRegisterRequest>({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      username: '',
    },
    mode: 'onChange',
    resolver: yupResolver(registerSchema) as Resolver<IAuthRegisterRequest>,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const onSubmit: SubmitHandler<IAuthRegisterRequest> = async (values) => {
    authRegisterMutation.mutate(values);
  };

  const renderIcon = (onClick: () => void) => {
    return (
      <BaseLucideIcon
        icon={showPassword ? Eye : EyeOff}
        onClick={onClick}
        size={22}
      />
    );
  };

  const authRegisterMutation = useAuthRegisterMutation(registerForm);

  return (
    <div className={styles.container}>
      <section>
        <h4>{t('auth.register')}</h4>

        <FormProvider {...registerForm}>
          <BaseForm
            layout="vertical"
            onFinish={registerForm.handleSubmit(onSubmit)}
          >
            <BaseFormItem
              label={
                <>
                  <span>{t('auth.email')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="email"
            >
              <BaseInput placeholder="name@email.com" />
            </BaseFormItem>

            <BaseFormItem
              label={
                <>
                  <span>{t('auth.password')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="password"
            >
              <BaseInput
                placeholder={t('auth.inputPassword')}
                suffix={renderIcon(togglePasswordVisibility)}
                type={showPassword ? 'text' : 'password'}
              />
            </BaseFormItem>

            <BaseFormItem
              label={
                <>
                  <span>{t('auth.passwordConfirm')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="passwordConfirm"
            >
              <BaseInput
                placeholder={t('auth.inputPassword')}
                suffix={renderIcon(togglePasswordConfirmVisibility)}
                type={showPasswordConfirm ? 'text' : 'password'}
              />
            </BaseFormItem>

            <BaseFormItem
              label={
                <>
                  <span>{t('auth.username')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="username"
            >
              <BaseInput placeholder={t('auth.enterYourUsername')} />
            </BaseFormItem>

            <BaseFormItem
              label={
                <>
                  <span>{t('auth.displayName')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="displayName"
            >
              <BaseInput placeholder={t('auth.enterYourDisplayName')} />
            </BaseFormItem>

            <BaseButton className="mt-2 w-full" htmlType="submit">
              {t('auth.register')}
            </BaseButton>
          </BaseForm>
        </FormProvider>

        <div className={styles.containerLoginNow}>
          <p>{t('auth.hasAccount')}</p>
          <Link to={AUTH_PAGE.LOGIN}>{t('auth.loginNow')}</Link>
        </div>
      </section>
    </div>
  );
};
