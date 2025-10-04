import { yupResolver } from '@hookform/resolvers/yup';
import {
  CheckboxProps,
  DatePickerProps,
  Form,
  PaginationProps,
  TimePickerProps,
  Tooltip,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import {
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from 'usehooks-ts';

import { healthCheckApi } from '@/renderer/apis/shared.api';
import IconDashboard from '@/renderer/assets/icons/shared/IconDashboard.svg?react';
import IconDelete from '@/renderer/assets/icons/shared/IconDelete.svg?react';
import IconFolderShared from '@/renderer/assets/icons/shared/IconFolderShared.svg?react';
import IconNotification from '@/renderer/assets/icons/shared/IconNotification.svg?react';
import IconSearch from '@/renderer/assets/icons/shared/IconSearch.svg?react';
import IconSettings from '@/renderer/assets/icons/shared/IconSettings.svg?react';
import styles from '@/renderer/assets/styles/components/shared/codebase-page.module.scss';
import { BaseAutocomplete } from '@/renderer/components/shared/BaseAutocomplete';
import { BaseButton } from '@/renderer/components/shared/BaseButton';
import { BaseCheckbox } from '@/renderer/components/shared/BaseCheckbox';
import { BaseCheckboxGroup } from '@/renderer/components/shared/BaseCheckboxGroup';
import { BaseDatePicker } from '@/renderer/components/shared/BaseDatePicker';
import { BaseFormItem } from '@/renderer/components/shared/BaseFormItem';
import { BaseInput } from '@/renderer/components/shared/BaseInput';
import { BaseInputNumber } from '@/renderer/components/shared/BaseInputNumber';
import { BaseModal } from '@/renderer/components/shared/BaseModal';
import { BasePagination } from '@/renderer/components/shared/BasePagination';
import { BaseSelect } from '@/renderer/components/shared/BaseSelect';
import { BaseSwitch } from '@/renderer/components/shared/BaseSwitch';
import { BaseTable } from '@/renderer/components/shared/BaseTable';
import { BaseTimePicker } from '@/renderer/components/shared/BaseTimePicker';
import { usePagination } from '@/renderer/hooks/shared/use-pagination';
import { useThemeColor } from '@/renderer/hooks/shared/use-theme-color';
import {
  baseCheckboxOptions,
  baseSelectOptions,
  suggestions,
  tableColumns,
  tableData,
} from '@/renderer/mocks/codebase.mock';
import { codebaseSchema } from '@/renderer/schemas/shared.schema';
import { useLoadingStore } from '@/renderer/stores/loading.store';
import { ROOT_THEME } from '@/shared/definitions/constants/theme-colors.const';
import { EToast } from '@/shared/definitions/enums/shared.enum';
import { showToast } from '@/shared/utils/notification.util';
import { sleep } from '@/shared/utils/shared.util';

import { useConfirmModal } from '../hooks/shared/use-confirm-modal';

interface IForm {
  email: string;
  fullName: string;
  password: string;
  passwordConfirm: string;
  terms: boolean;
  type: string;
}

type TIcons = Record<
  string,
  { default: React.FC<React.SVGProps<SVGSVGElement>> }
>;

export const CodebasePage: React.FC = () => {
  const codebaseForm = useForm<IForm>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
      terms: false,
      type: '',
    },
    mode: 'onChange',
    resolver: yupResolver(codebaseSchema) as Resolver<IForm>,
  });
  const { t } = useTranslation();
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const { getThemeColor } = useThemeColor();
  const { pagination, setPagination } = usePagination();
  const { showConfirmModal } = useConfirmModal();

  const [baseCheckbox, setBaseCheckbox] = useState<boolean>(false);
  const [baseCheckboxAll, setBaseCheckboxAll] = useState<boolean>(false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);
  const [baseCheckboxGroup, setBaseCheckboxGroup] = useState<unknown[]>([]);
  const [baseSwitch, setBaseSwitch] = useState<boolean>(true);
  const [baseAutocomplete, setBaseAutocomplete] = useState<string>('');
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [baseInput, setBaseInput] = useState<number | string>();
  const [baseInputNumber, setBaseInputNumber] = useState<number | string>();
  const [baseDatePicker, setBaseDatePicker] = useState<Dayjs | null>();
  const [baseTimePicker, setBaseTimePicker] = useState<Dayjs | null>(null);
  const [baseModal, setBaseModal] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [svgIcons, setSvgIcons] = useState<Record<string, React.FC>>({});

  const handleGetHealthCheck = useDebounceCallback(async () => {
    await healthCheckApi();
  }, 200);

  const handleClickIconSvg = useDebounceCallback(() => {
    showToast('handleClickIconSvg');
  }, 200);

  const handleClickButton = useDebounceCallback(() => {
    showToast('handleClickButton');
  }, 200);

  const handleChangeSelect = (value: string) => {
    showToast(`handleChangeSelect: ${value}`);
  };

  const handleChangeCheckbox: CheckboxProps['onChange'] = (event) => {
    setBaseCheckbox(event.target.checked);
    showToast(`handleChangeCheckbox: ${event.target.checked}`);
  };

  const handleCheckAllChange: CheckboxProps['onChange'] = (event) => {
    setBaseCheckboxAll(event.target.checked);
    setIsIndeterminate(false);
    setBaseCheckboxGroup(
      event.target.checked
        ? baseCheckboxOptions.map((option) => option.value)
        : [],
    );
  };

  const handleCheckboxGroupChange = (checkedValues: unknown[]) => {
    setBaseCheckboxGroup(checkedValues);
    setIsIndeterminate(
      checkedValues.length > 0 &&
        checkedValues.length < baseCheckboxOptions.length,
    );
    setBaseCheckboxAll(checkedValues.length === baseCheckboxOptions.length);
  };

  const handleChangeSwitch = (checked: boolean) => {
    setBaseSwitch(checked);
    showToast(`handleChangeSwitch: ${checked}`);
  };

  const handleSearch = (value: string) => {
    const results = suggestions.filter((suggestion) =>
      suggestion.value.toLowerCase().includes(value.toLowerCase()),
    );
    setBaseAutocomplete(value);
    setOptions(results);
  };

  const handleChangeInput = useDebounceCallback((value: number | string) => {
    showToast(`handleChangeInput: ${value}`);
  }, 200);

  const handleChangeDatePicker: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    setBaseDatePicker(date);
    showToast(`handleChangeDatePicker: ${dateString}`);
  };

  const handleChangeTimePicker: TimePickerProps['onChange'] = (
    time,
    timeString,
  ) => {
    setBaseTimePicker(time);
    showToast(`handleChangeTimePicker: ${timeString}`);
  };

  const handleModal = () => {
    setBaseModal(false);
    showToast('handleConfirmDialog', EToast.Info);
  };

  const handleChangePagination: PaginationProps['onChange'] = (
    page,
    pageSize,
  ) => {
    setPagination({ currentPage: page, pageSize, total: tableData.length });
  };

  const onSubmit: SubmitHandler<IForm> = async (values) => {
    console.info('onSubmit:', values);
    showToast('onSubmit: check console');
  };

  const handleLoadingFullscreen = async () => {
    showLoading();
    await sleep(3);
    hideLoading();
  };

  const loadSvgIcons = async () => {
    const icons: TIcons = import.meta.glob('@/renderer/assets/icons/**/*.svg', {
      eager: true,
      query: '?react',
    });
    const newIcons: Record<string, React.FC> = {};

    Object.entries(icons).forEach(([path, module]) => {
      const iconName = path.split('/').pop()?.replace('.svg', '');
      if (iconName) newIcons[iconName] = module.default;
    });
    setSvgIcons(newIcons);
  };

  useEffect(() => {
    loadSvgIcons();
    setPagination((state) => ({ ...state, total: tableData.length }));
  }, []);

  return (
    <div className={styles.container}>
      <section>
        <h4>-- i18n --</h4>
        <div className="flex items-center gap-4">
          <p>{t('shared.hello')}</p>
        </div>
      </section>

      <section>
        <h4>-- APIs --</h4>
        <BaseButton onClick={handleGetHealthCheck}>Health Check</BaseButton>
      </section>

      <section>
        <h4>-- The Loading --</h4>
        <BaseButton onClick={handleLoadingFullscreen}>Fullscreen</BaseButton>
      </section>

      <section>
        <h4>-- SVG Icons --</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(svgIcons).map(([iconName, IconComponent]) => (
            <Tooltip key={iconName} title={iconName}>
              <span onClick={handleClickIconSvg}>
                <IconComponent />
              </span>
            </Tooltip>
          ))}
        </div>
      </section>

      <section>
        <h4>-- Base Buttons --</h4>
        <div className="mb-4 flex gap-2">
          <BaseButton onClick={handleClickButton}>Primary</BaseButton>
          <BaseButton color="blue" onClick={handleClickButton} variant="solid">
            Blue
          </BaseButton>
          <BaseButton color="green" onClick={handleClickButton} variant="solid">
            Green
          </BaseButton>
          <BaseButton
            color="orange"
            onClick={handleClickButton}
            variant="solid"
          >
            Orange
          </BaseButton>
          <BaseButton
            color="danger"
            onClick={handleClickButton}
            variant="solid"
          >
            Danger
          </BaseButton>
          <BaseButton
            color="default"
            onClick={handleClickButton}
            variant="solid"
          >
            Default
          </BaseButton>
        </div>

        <div className="mb-4 flex gap-2">
          <BaseButton
            color="primary"
            onClick={handleClickButton}
            variant="outlined"
          >
            Primary
          </BaseButton>
          <BaseButton
            color="blue"
            onClick={handleClickButton}
            variant="outlined"
          >
            Blue
          </BaseButton>
          <BaseButton
            color="green"
            onClick={handleClickButton}
            variant="outlined"
          >
            Green
          </BaseButton>
          <BaseButton
            color="orange"
            onClick={handleClickButton}
            variant="outlined"
          >
            Orange
          </BaseButton>
          <BaseButton
            color="danger"
            onClick={handleClickButton}
            variant="outlined"
          >
            Danger
          </BaseButton>
          <BaseButton
            color="default"
            onClick={handleClickButton}
            variant="outlined"
          >
            Default
          </BaseButton>
        </div>

        <div className="mb-4 flex gap-2">
          <BaseButton
            icon={<IconSearch fill={ROOT_THEME.WHITE} height="14" width="14" />}
            onClick={handleClickButton}
            shape="circle"
          />
          <BaseButton
            color="blue"
            icon={
              <IconSettings fill={ROOT_THEME.WHITE} height="14" width="14" />
            }
            onClick={handleClickButton}
            shape="circle"
            variant="solid"
          />
          <BaseButton
            color="green"
            icon={
              <IconDashboard fill={ROOT_THEME.WHITE} height="14" width="14" />
            }
            onClick={handleClickButton}
            shape="circle"
            variant="solid"
          />
          <BaseButton
            color="orange"
            icon={
              <IconFolderShared
                fill={ROOT_THEME.WHITE}
                height="14"
                width="14"
              />
            }
            onClick={handleClickButton}
            shape="circle"
            variant="solid"
          />
          <BaseButton
            color="danger"
            icon={<IconDelete fill={ROOT_THEME.WHITE} height="14" width="14" />}
            onClick={handleClickButton}
            shape="circle"
            variant="solid"
          />
          <BaseButton
            color="default"
            icon={
              <IconNotification
                fill={getThemeColor('ICON_SVG')}
                height="14"
                width="14"
              />
            }
            onClick={handleClickButton}
            shape="circle"
            variant="outlined"
          />
        </div>
      </section>

      <section>
        <h4>-- Base Selects --</h4>
        <BaseSelect
          onChange={handleChangeSelect}
          options={baseSelectOptions}
          placeholder="Please select"
          style={{ width: 150 }}
        />

        <BaseSelect
          mode="multiple"
          onChange={handleChangeSelect}
          options={baseSelectOptions}
          placeholder="Please multiple select"
          style={{ marginLeft: 16, width: 200 }}
        />
      </section>

      <section>
        <h4>-- Base Checkboxes --</h4>
        <div>
          <BaseCheckbox checked={baseCheckbox} onChange={handleChangeCheckbox}>
            checkbox label
          </BaseCheckbox>
        </div>

        <div>
          <BaseCheckbox
            checked={baseCheckboxAll}
            className="mt-4 mb-1"
            indeterminate={isIndeterminate}
            onChange={handleCheckAllChange}
          >
            Check all
          </BaseCheckbox>
        </div>
        <BaseCheckboxGroup
          onChange={handleCheckboxGroupChange}
          options={baseCheckboxOptions}
          value={baseCheckboxGroup}
        />
      </section>

      <section>
        <h4>-- Base Switches --</h4>
        <div className="flex items-center">
          <BaseSwitch checked={baseSwitch} onChange={handleChangeSwitch} />
          <span className="ml-2">switch label</span>
        </div>
      </section>

      <section>
        <h4>-- Base Autocompletes --</h4>
        <BaseAutocomplete
          onChange={setBaseAutocomplete}
          onSearch={handleSearch}
          options={options}
          placeholder="Please input"
          style={{ width: 200 }}
          value={baseAutocomplete}
        />
      </section>

      <section>
        <h4>-- Base Inputs --</h4>
        <div className="flex gap-2">
          <BaseInput
            className="!w-[200px]"
            onChange={(event) => {
              setBaseInput(event.target.value);
              handleChangeInput(event.target.value);
            }}
            placeholder="Please input"
            value={baseInput}
          />

          <BaseInputNumber
            className="!w-[200px]"
            onChange={(value) => {
              setBaseInputNumber(value as number | string);
              handleChangeInput(value as number | string);
            }}
            placeholder="Please input number"
            value={baseInputNumber}
          />

          <BaseInput
            allowClear
            className="!w-[300px]"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={`${t('shared.search')}...`}
            type="search"
            value={searchInput}
          />
        </div>
      </section>

      <section>
        <h4>-- Base DatePickers --</h4>
        <BaseDatePicker
          onChange={handleChangeDatePicker}
          placeholder="Pick a day"
          value={baseDatePicker}
        />
      </section>

      <section>
        <h4>-- Base TimePickers --</h4>
        <BaseTimePicker
          onChange={handleChangeTimePicker}
          placeholder="Pick a time"
          value={baseTimePicker}
        />
      </section>

      <section>
        <h4>-- Base Modals --</h4>
        <div className="flex gap-2">
          <BaseButton onClick={() => setBaseModal(true)}>Open Modal</BaseButton>
          <BaseModal
            footer={[
              <BaseButton key="ok" onClick={handleModal}>
                OK
              </BaseButton>,
            ]}
            onCancel={() => setBaseModal(false)}
            open={baseModal}
            title="Modal Title"
            width={500}
          >
            <span>This is a modal content</span>
          </BaseModal>

          <BaseButton
            onClick={() =>
              showConfirmModal({
                content: 'This is a confirm modal content',
                onCancel: () => showToast('onCancel'),
                onConfirm: () => showToast('onConfirm'),
                title: 'Confirm Modal',
              })
            }
          >
            Confirm Modal
          </BaseButton>
        </div>
      </section>

      <section>
        <h4>-- Base Tables --</h4>
        <BaseTable
          columns={tableColumns}
          dataSource={tableData}
          rowKey="id"
          scroll={{ y: 300 }}
        />

        <BasePagination
          className="flex-center mt-4"
          current={pagination.currentPage}
          onChange={handleChangePagination}
          pageSize={pagination.pageSize}
          showSizeChanger
          total={pagination.total}
        />
      </section>

      <section>
        <h4>-- Base Forms --</h4>
        <FormProvider {...codebaseForm}>
          <Form
            layout="vertical"
            onFinish={codebaseForm.handleSubmit(onSubmit)}
            style={{ maxWidth: '600px' }}
          >
            <div className="grid grid-cols-2 gap-4">
              <BaseFormItem label="Full Name" name="fullName" required>
                <BaseInput placeholder="Enter your full name" />
              </BaseFormItem>

              <BaseFormItem label="Type" name="type" required>
                <BaseSelect
                  options={baseSelectOptions}
                  placeholder="Choose a type"
                />
              </BaseFormItem>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <BaseFormItem label="Email" name="email" required>
                <BaseInput placeholder="Enter your email address" />
              </BaseFormItem>

              <BaseFormItem label="Password" name="password" required>
                <BaseInput placeholder="Create a password" type="password" />
              </BaseFormItem>

              <BaseFormItem
                label="Confirm Password"
                name="passwordConfirm"
                required
              >
                <BaseInput
                  placeholder="Re-enter your password"
                  type="password"
                />
              </BaseFormItem>
            </div>

            <BaseFormItem name="terms" required valuePropName="checked">
              <BaseCheckbox>Agree to terms and conditions</BaseCheckbox>
            </BaseFormItem>

            <div className="flex gap-2">
              <BaseButton htmlType="submit">Submit</BaseButton>
              <BaseButton
                color="default"
                onClick={() => codebaseForm.reset()}
                type="default"
              >
                Reset
              </BaseButton>
            </div>
          </Form>
        </FormProvider>
      </section>
    </div>
  );
};
