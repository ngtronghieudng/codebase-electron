import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
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
import styles from '@/renderer/assets/styles/components/auth/auth-login-page.module.scss';
import { BaseButton } from '@/renderer/components/shared/BaseButton';
import { BaseFormItem } from '@/renderer/components/shared/BaseFormItem';
import { BaseInput } from '@/renderer/components/shared/BaseInput';
import { BaseLucideIcon } from '@/renderer/components/shared/BaseLucideIcon';
import { useAuthLoginMutation } from '@/renderer/hooks/auth/use-auth-mutations';
import { loginSchema } from '@/renderer/schemas/auth.schema';
import { AUTH_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { IAuthLoginRequest } from '@/shared/definitions/interfaces/auth.interface';

export const AuthLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const authLoginMutation = useAuthLoginMutation();
  const loginForm = useForm<IAuthLoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(loginSchema) as Resolver<IAuthLoginRequest>,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IAuthLoginRequest> = async (values) => {
    authLoginMutation.mutate(values);
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

  return (
    <div className={styles.container}>
      <section>
        <h4>{t('auth.login')}</h4>

        <FormProvider {...loginForm}>
          <Form layout="vertical" onFinish={loginForm.handleSubmit(onSubmit)}>
            <BaseFormItem
              label={
                <>
                  <span>{t('auth.email')}</span>
                  <IconRequired className="ml-1" height="10" width="5" />
                </>
              }
              name="email"
            >
              <BaseInput placeholder="name@email.com" type="text" />
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

            <BaseButton className="mt-2 w-full" htmlType="submit">
              {t('auth.login')}
            </BaseButton>
          </Form>
        </FormProvider>

        <div className={styles.containerRegisterNow}>
          <p>{t('auth.noAccount')}</p>
          <Link to={AUTH_PAGE.REGISTER}>{t('auth.registerNow')}</Link>
        </div>
      </section>
    </div>
  );
};
