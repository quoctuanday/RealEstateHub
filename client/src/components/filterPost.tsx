'use client';
import { getPost } from '@/api/api';
import { Post } from '@/schema/Post';
import { Button, DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface Props {
    className: string;
    setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>;
}

function FilterPost({ className, setPosts }: Props) {
    const [filters, setFilters] = useState({
        dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
        status: '',
        postType: '',
    });

    const handleFilter = async () => {
        const { dateRange, status, postType } = filters;
        const query = {
            startDate: dateRange ? dateRange[0].toISOString() : undefined,
            endDate: dateRange ? dateRange[1].toISOString() : undefined,
            ...(status && { status }),
            ...(postType && { postType }),
        };
        const response = await getPost(query);
        if (response) {
            console.log(response.data);
            setPosts(response.data);
        }
    };

    return (
        <Form className={`mt-[1.25rem] ${className}`}>
            <h1 className="roboto-bold">Lọc theo</h1>
            <div className="flex gap-4 flex-wrap">
                <div>
                    <span>Ngày đăng:</span>
                    <DatePicker.RangePicker
                        className="ml-2"
                        onChange={(dates) =>
                            setFilters((prev) => ({
                                ...prev,
                                dateRange: dates as
                                    | [dayjs.Dayjs, dayjs.Dayjs]
                                    | null,
                            }))
                        }
                    />
                </div>
                <div>
                    <span>Trạng thái:</span>
                    <Select
                        allowClear
                        className="ml-2 w-[10rem]"
                        placeholder="Chọn trạng thái"
                        onChange={(value) =>
                            setFilters((prev) => ({ ...prev, status: value }))
                        }
                    >
                        <Select.Option value="pending">Chờ xử lí</Select.Option>
                        <Select.Option value="decline">
                            Bị từ chối
                        </Select.Option>
                        <Select.Option value="active">
                            Đang hoạt động
                        </Select.Option>
                        <Select.Option value="archived">
                            Đang lưu trữ
                        </Select.Option>
                        <Select.Option value="deleted">Đã xóa</Select.Option>
                    </Select>
                </div>
                <div>
                    <span>Loại tin đăng:</span>
                    <Select
                        allowClear
                        className="ml-2 w-[10rem]"
                        placeholder="Chọn loại tin"
                        onChange={(value) =>
                            setFilters((prev) => ({ ...prev, postType: value }))
                        }
                    >
                        <Select.Option value="sell">Bán</Select.Option>
                        <Select.Option value="rent">Cho thuê</Select.Option>
                    </Select>
                </div>
                <Button type="primary" onClick={handleFilter}>
                    Lọc
                </Button>
            </div>
        </Form>
    );
}

export default FilterPost;
