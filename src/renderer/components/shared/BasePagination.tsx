import { Pagination, PaginationProps } from 'antd';
import { memo } from 'react';

import { PAGINATION } from '@/shared/definitions/constants/shared.const';

interface IProps extends PaginationProps {
  pageSizes?: number[];
  total: number;
}

export const BasePagination: React.FC<IProps> = memo(
  ({ pageSizes = [50, 100, 150, 200], total, ...otherProps }) => {
    return (
      <Pagination
        defaultPageSize={PAGINATION.DEFAULT_PAGE_SIZE}
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
