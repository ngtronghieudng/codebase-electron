import { Pagination, PaginationProps } from 'antd';
import { memo } from 'react';

interface IProps extends PaginationProps {
  pageSizes?: number[];
  total: number;
}

export const BasePagination: React.FC<IProps> = memo(
  ({ pageSizes = [100, 200, 300, 400], total, ...otherProps }) => {
    return (
      <Pagination
        defaultPageSize={100}
        pageSizeOptions={pageSizes}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
        total={total}
        {...otherProps}
      />
    );
  },
);

BasePagination.displayName = 'BasePagination';
