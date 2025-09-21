import { Menu, MenuProps } from 'antd';

interface IProps extends MenuProps {}

export const BaseMenu: React.FC<IProps> = ({ items, ...otherProps }) => {
  return <Menu items={items} {...otherProps} />;
};
