/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Pagination } from 'antd';

interface Props {
    setQuery: React.Dispatch<React.SetStateAction<any>>;
    total: number;
    current: number;
    pageSize: number;
}

const PaginationComponent: React.FC<Props> = ({
    setQuery,
    total,
    current,
    pageSize,
}) => {
    const handlePageChange = (page: number, size?: number) => {
        setQuery((prev: any) => ({
            ...prev,
            page,
            limit: size || prev.limit,
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

export default PaginationComponent;
