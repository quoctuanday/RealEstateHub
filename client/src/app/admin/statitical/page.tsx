/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getCount } from '@/api/api';
import { BarChart } from '@/components/barchart';
import React, { useEffect, useState } from 'react';
import { AiOutlineRedo } from 'react-icons/ai';
import { MdFilterListAlt } from 'react-icons/md';
import { DatePicker, Form, Button, Spin, message } from 'antd';

interface Props {
    totalRevenue: number;
    userCount: number;
    currentPostCount: number;
    postStatusCounts: {
        pending: number;
        active: number;
        decline: number;
        archived: number;
        deleted: number;
    };
}

function Satiticalpage() {
    const [data, setData] = useState<Props | null>(null);
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async (startDate: Date, endDate: Date) => {
        try {
            setLoading(true);
            const response = await getCount(startDate, endDate);
            if (response) {
                setStart(startDate);
                setEnd(endDate);
                setData(response.data.data);
            }
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const defaultStart = new Date(new Date().getFullYear(), 0, 1);
        const defaultEnd = new Date();
        getData(defaultStart, defaultEnd);
    }, []);

    const handleFilter = (values: any) => {
        if (values.range && values.range.length === 2) {
            const starts = values.range[0].toDate();
            const ends = values.range[1].toDate();
            getData(starts, ends);
        }
    };

    const redo = () => {
        const defaultStart = new Date(new Date().getFullYear(), 0, 1);
        const defaultEnd = new Date();
        getData(defaultStart, defaultEnd);
    };

    return (
        <div className=" bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-md p-4 rounded-md gap-4">
                <Form layout="inline" onFinish={handleFilter}>
                    <Form.Item
                        name="range"
                        rules={[
                            {
                                required: true,
                                message: 'Chọn khoảng thời gian!',
                            },
                        ]}
                    >
                        <DatePicker.RangePicker
                            format="YYYY-MM-DD"
                            allowClear={false}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<MdFilterListAlt />}
                        >
                            Lọc
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            icon={<AiOutlineRedo />}
                            onClick={redo}
                            type="default"
                        />
                    </Form.Item>
                </Form>
            </div>

            <div className="mt-6 bg-white shadow-md rounded-md p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Spin size="large" />
                    </div>
                ) : data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md shadow">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Thống kê chung
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tổng số người dùng: {data.userCount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Tổng doanh thu:{' '}
                                    {data.totalRevenue.toLocaleString()}₫
                                </p>
                            </div>
                            {start && end && (
                                <div className="bg-gray-50 p-4 rounded-md shadow">
                                    <BarChart start={start} end={end} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md shadow">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Bài đăng thuê phòng
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tổng số bài đăng: {data.currentPostCount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Đã duyệt:{' '}
                                    {data.postStatusCounts.active || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Chưa duyệt:{' '}
                                    {data.postStatusCounts.pending || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Bị từ chối:{' '}
                                    {data.postStatusCounts.decline || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Được lưu trữ:{' '}
                                    {data.postStatusCounts.pending || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Đã xóa: {data.postStatusCounts.deleted || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Satiticalpage;
