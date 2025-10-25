import { Table, TableProps } from 'antd';
import { ColumnType } from 'antd/es/table';
import { memo } from 'react';

interface IProps<T> extends TableProps<T> {
  columns: ColumnType<T>[];
}

function BaseTableComponent<T>({ ...otherProps }: IProps<T>) {
  return <Table<T> {...otherProps} />;
}

export const BaseTable = memo(BaseTableComponent) as typeof BaseTableComponent;
