import { Tooltip, TooltipProps } from 'antd';
import { CSSProperties, memo, useMemo } from 'react';

import { BORDER_RADIUS } from '@/renderer/definitions/constants/style-variables.const';

type TProps = TooltipProps;

export const BaseTooltip: React.FC<TProps> = memo(
  ({
    arrow = false,
    children,
    placement = 'bottom',
    styles,
    ...otherProps
  }) => {
    const mergedStyles = useMemo(
      () => ({
        ...styles,
        body: { ...DEFAULT_BODY_STYLE, ...styles?.body },
        root: { ...DEFAULT_ROOT_STYLE, ...styles?.root },
      }),
      [styles],
    );

    return (
      <Tooltip
        arrow={arrow}
        color="var(--color-theme-bg-content)"
        placement={placement}
        styles={mergedStyles}
        {...otherProps}
      >
        {children}
      </Tooltip>
    );
  },
);

const DEFAULT_ROOT_STYLE: CSSProperties = {
  border: '1px solid var(--theme-border-color)',
  borderRadius: BORDER_RADIUS.TOOLTIP,
};

const DEFAULT_BODY_STYLE: CSSProperties = {
  color: 'var(--color-theme-text)',
  fontSize: '12px',
  fontWeight: 500,
  minHeight: 'auto',
  padding: '2px 6px',
  whiteSpace: 'pre-line',
};

BaseTooltip.displayName = 'BaseTooltip';
