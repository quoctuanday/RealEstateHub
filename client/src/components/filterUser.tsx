'use client';
import { getAllUser } from '@/api/api';
import { User } from '@/schema/User';
import { Button, DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
    className?: string;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

interface Filters {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
    role: string;
    isBlocked: boolean | null;
}

function FilterUsers({ className, setUsers }: Props) {
    const [filters, setFilters] = useState<Filters>({
        dateRange: null,
        role: '',
        isBlocked: null,
    });

    const handleFilter = async () => {
        const { dateRange, role, isBlocked } = filters;
        const query = {
            startDate: dateRange ? dateRange[0].toISOString() : undefined,
            endDate: dateRange ? dateRange[1].toISOString() : undefined,
            ...(role && { role }),
            ...(isBlocked !== null && { isBlocked }),
        };
        const response = await getAllUser(query);
        if (response) {
            console.log(response.data.data);
            setUsers(response.data.data);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
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
                        <span>Vai trò:</span>
                        <Select
                            allowClear
                            className="ml-2 w-[10rem]"
                            placeholder="Chọn vai trò"
                            onChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    role: value || '',
                                }))
                            }
                        >
                            <Select.Option value="user">
                                Người dùng
                            </Select.Option>
                            <Select.Option value="moderator">
                                Kiểm duyệt viên
                            </Select.Option>
                            <Select.Option value="admin">
                                Quản trị viên
                            </Select.Option>
                        </Select>
                    </div>
                    <div>
                        <span>Trạng thái:</span>
                        <Select
                            allowClear
                            className="ml-2 w-[10rem]"
                            placeholder="Chọn trạng thái"
                            onChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    isBlocked:
                                        value !== undefined
                                            ? value === 'true'
                                            : null,
                                }))
                            }
                        >
                            <Select.Option value="true">Đã khóa</Select.Option>
                            <Select.Option value="false">
                                Chưa khóa
                            </Select.Option>
                        </Select>
                    </div>
                    <Button type="primary" onClick={handleFilter}>
                        Lọc
                    </Button>
                </div>
            </Form>
        </motion.div>
    );
}

export default FilterUsers;
