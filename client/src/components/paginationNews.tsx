/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Pagination } from 'antd';

interface PaginationComponentProps {
    total: number;
    current: number;
    pageSize: number;
    setQuery: React.Dispatch<React.SetStateAction<any>>;
}

const PaginationNewsComponent: React.FC<PaginationComponentProps> = ({
    total,
    current,
    pageSize,
    setQuery,
}) => {
    const handlePageChange = (page: number, pageSize?: number) => {
        setQuery((prev: any) => ({
            ...prev,
            page,
            limit: pageSize || prev.limit,
        }));
    };

    return (
        <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
        />
    );
};

export default PaginationNewsComponent;
