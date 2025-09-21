import { Popover, PopoverProps } from 'antd';

interface IProps extends PopoverProps {}

export const BasePopover: React.FC<IProps> = ({ children, ...otherProps }) => {
  return <Popover {...otherProps}>{children}</Popover>;
};
