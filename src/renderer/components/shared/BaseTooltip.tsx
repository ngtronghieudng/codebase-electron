import { Tooltip, TooltipProps } from 'antd';
import { memo } from 'react';

type IProps = TooltipProps;

export const BaseTooltip: React.FC<IProps> = memo(
  ({ children, placement = 'bottom', styles, ...otherProps }) => {
    return (
      <Tooltip
        color="var(--theme-bg-content-color)"
        placement={placement}
        styles={{
          body: {
            color: 'var(--theme-text-color)',
            fontSize: '12px',
            fontWeight: 500,
            minHeight: 'auto',
            padding: '2px 6px',
            ...styles?.body,
          },
          ...styles,
        }}
        {...otherProps}
      >
        {children}
      </Tooltip>
    );
  },
);

BaseTooltip.displayName = 'BaseTooltip';
