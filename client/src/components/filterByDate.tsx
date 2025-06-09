/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { DatePicker, Form, Button } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface Props {
    setQuery: React.Dispatch<React.SetStateAction<any>>;
    className?: string;
}

const FilterByDate: React.FC<Props> = ({ setQuery, className = '' }) => {
    const [dateRange, setDateRange] = useState<
        [dayjs.Dayjs, dayjs.Dayjs] | null
    >(null);

    const handleFilter = () => {
        setQuery((prev: any) => ({
            ...prev,
            startDate: dateRange ? dateRange[0].toISOString() : undefined,
            endDate: dateRange ? dateRange[1].toISOString() : undefined,
            page: 1,
        }));
    };

    return (
        <Form className={`mt-[1.25rem] ${className}`}>
            <h1 className="roboto-bold mb-2">Lọc theo ngày đăng</h1>
            <div className="flex gap-4 flex-wrap items-center">
                <DatePicker.RangePicker
                    onChange={(dates) =>
                        setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
                    }
                />
                <Button type="primary" onClick={handleFilter}>
                    Lọc
                </Button>
            </div>
        </Form>
    );
};

export default FilterByDate;
