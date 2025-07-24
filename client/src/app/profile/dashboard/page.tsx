/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
    deleteNotify,
    getNotify,
    getPost,
    getTransactionHistory,
    updateNotify,
} from '@/api/api';
import FooterPage from '@/components/footer';
import TitleComponent from '@/components/title';
import TransactionChart from '@/components/TransactionChart';
import { Notify } from '@/schema/notification';
import { useUser } from '@/store/store';
import { Spin, Tag, Divider, Typography, Modal, message } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsFillPostcardFill } from 'react-icons/bs';
import { FaCoins, FaRegTrashAlt } from 'react-icons/fa';
const { Title, Paragraph, Text } = Typography;
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

function DashboardPage() {
    const { userLoginData } = useUser();
    const [transactions, setTransactions] = useState<
        { date: string; amount: number }[]
    >([]);
    const [pending, setPending] = useState(0);
    const [active, setActive] = useState(0);
    const [decline, setDecline] = useState(0);
    const [expired, setExpired] = useState(0);
    const [archived, setArchived] = useState(0);
    const [deleted, setDeleted] = useState(0);

    const [isCheckout, setIsCheckout] = useState(0);
    const [notify, setNotify] = useState<Notify[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNotify, setSelectedNotify] = useState<Notify | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([
        null,
        null,
    ]);

    const handleSelectNotify = async (item: Notify) => {
        setSelectedNotify(item);

        if (!item.isRead) {
            try {
                await updateNotify(item._id, { isRead: true });
                setNotify((prev) =>
                    (prev ?? []).map((n) =>
                        n._id === item._id ? { ...n, isRead: true } : n
                    )
                );
                setSelectedNotify({ ...item, isRead: true });
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái đã đọc:', error);
            }
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNotify(null);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            const query = {
                isCount: true,
                status: [
                    'pending',
                    'active',
                    'decline',
                    'expired',
                    'archived',
                    'deleted',
                ],
                isCheckout: false,
                person: true,
            };
            const response = await getPost(query);
            if (response) {
                const { counts } = response.data;
                setPending(counts['status:pending'] || 0);
                setActive(counts['status:active'] || 0);
                setDecline(counts['status:decline'] || 0);
                setExpired(counts['status:expired'] || 0);
                setArchived(counts['status:archived'] || 0);
                setDeleted(counts['status:deleted'] || 0);
                setIsCheckout(counts['isCheckout:false'] || 0);
                console.log(counts);
            }
        };

        const fetchNotifications = async () => {
            setLoading(true);
            const response = await getNotify();
            if (response) {
                setNotify(response.data.notify);
                console.log(response.data);
            }
            setLoading(false);
        };

        Promise.all([fetchCounts(), fetchNotifications()]);
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            const params: any = {};
            if (dateRange[0]) params.startDate = dateRange[0];
            if (dateRange[1]) params.endDate = dateRange[1];

            const response = await getTransactionHistory(params);
            if (response) {
                const data = response.data.transactions.map((t: any) => ({
                    date: new Date(t.createdAt).toLocaleDateString('vi-VN'),
                    amount: t.amount,
                }));
                console.log('data co su thay doi', data);
                setTransactions(data);
            }
        };

        fetchTransactions();
    }, [dateRange]);

    return (
        <div className="mt-[1.25rem]">
            <TitleComponent title="Tổng quan" />
            <div className="px-[8rem] mt-[1.25rem]">
                <h1 className="roboto-bold">Thống kê</h1>
                <div className="grid grid-cols-3 gap-4 mt-3">
                    {/* Số dư */}
                    <div className="col-span-1 rounded shadow-custom-light p-2">
                        <div className="flex items-center">
                            <i>
                                <FaCoins />
                            </i>
                            <h2 className="roboto-bold ml-2">Số dư</h2>
                        </div>
                        <div className="mt-3">
                            {userLoginData?.accountBalance?.toLocaleString(
                                'vi-VN'
                            )}{' '}
                            đ
                        </div>
                        <Link
                            href={'/profile/recharge'}
                            className="mt-2 block roboto-bold hover:underline text-rootColor"
                        >
                            Nạp tiền
                        </Link>
                    </div>

                    {/* Tin đăng */}
                    <div className="col-span-2 rounded shadow-custom-light p-2">
                        <div className="flex items-center">
                            <i>
                                <BsFillPostcardFill />
                            </i>
                            <h2 className="roboto-bold ml-2">Tin đăng</h2>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                                <div className="font-bold">{active}</div>
                                <p className="text-gray-400">Đang hiển thị</p>
                            </div>
                            <div>
                                <div className="font-bold">{pending}</div>
                                <p className="text-gray-400">Chờ duyệt</p>
                            </div>
                            <div>
                                <div className="font-bold">{isCheckout}</div>
                                <p className="text-gray-400">Chờ thanh toán</p>
                            </div>
                            <div>
                                <div className="font-bold">{decline}</div>
                                <p className="text-gray-400">Từ chối</p>
                            </div>
                            <div>
                                <div className="font-bold">{expired}</div>
                                <p className="text-gray-400">Hết hạn</p>
                            </div>
                            <div>
                                <div className="font-bold">{archived}</div>
                                <p className="text-gray-400">Lưu trữ</p>
                            </div>
                            <div>
                                <div className="font-bold">{deleted}</div>
                                <p className="text-gray-400">Đã xóa</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông báo */}
                    <div className="col-span-1 rounded shadow-custom-light p-4 mt-2">
                        <div className="flex items-center px-2 mb-2">
                            <h3 className="roboto-bold">Thông báo</h3>
                        </div>
                        <div className="w-full">
                            {loading ? (
                                <div className="flex items-center justify-center w-full">
                                    <Spin size="large" />
                                </div>
                            ) : notify && notify.length === 0 ? (
                                <div className="flex justify-center items-center w-full">
                                    Chưa có thông báo!
                                </div>
                            ) : (
                                <>
                                    <ul className="w-full max-h-[20rem] overflow-y-auto border rounded border-gray-200">
                                        {notify &&
                                            [...notify]
                                                .sort(
                                                    (a, b) =>
                                                        new Date(
                                                            b.createdAt || ''
                                                        ).getTime() -
                                                        new Date(
                                                            a.createdAt || ''
                                                        ).getTime()
                                                )
                                                .map((item) => (
                                                    <li
                                                        key={item._id}
                                                        className={`cursor-pointer border-b p-3 transition ${
                                                            item.isRead
                                                                ? 'bg-white'
                                                                : 'bg-gray-50 border-blue-500'
                                                        } hover:bg-gray-100`}
                                                        onClick={() =>
                                                            handleSelectNotify(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-medium text-sm line-clamp-1">
                                                                {item.title ||
                                                                    'Không có tiêu đề'}
                                                            </p>
                                                            {!item.isRead && (
                                                                <Tag
                                                                    color="blue"
                                                                    className="ml-2 text-xs"
                                                                >
                                                                    Chưa đọc
                                                                </Tag>
                                                            )}
                                                            <button
                                                                className="hover:text-red-500"
                                                                onClick={async (
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await deleteNotify(
                                                                            item._id
                                                                        );
                                                                        message.success(
                                                                            'Đã xóa thông báo'
                                                                        );

                                                                        setNotify(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                prev.filter(
                                                                                    (
                                                                                        thisItem
                                                                                    ) =>
                                                                                        thisItem._id !==
                                                                                        item._id
                                                                                )
                                                                        );

                                                                        if (
                                                                            selectedNotify?._id ===
                                                                            item._id
                                                                        ) {
                                                                            setSelectedNotify(
                                                                                null
                                                                            );
                                                                        }
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Lỗi khi xóa thông báo:',
                                                                            error
                                                                        );
                                                                        message.error(
                                                                            'Xóa thông báo thất bại'
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {item.createdAt
                                                                ? new Date(
                                                                      item.createdAt
                                                                  ).toLocaleString()
                                                                : '---'}
                                                        </p>
                                                    </li>
                                                ))}
                                    </ul>

                                    <Modal
                                        title="Chi tiết thông báo"
                                        open={modalOpen}
                                        onCancel={handleCloseModal}
                                        footer={null}
                                        width={600}
                                    >
                                        {selectedNotify ? (
                                            <>
                                                <div className="flex justify-between items-center mb-4">
                                                    <Title
                                                        level={5}
                                                        className="m-0"
                                                    >
                                                        {selectedNotify.title ||
                                                            'Không có tiêu đề'}
                                                    </Title>
                                                    <Tag
                                                        color={
                                                            selectedNotify.isRead
                                                                ? 'green'
                                                                : 'blue'
                                                        }
                                                    >
                                                        {selectedNotify.isRead
                                                            ? 'Đã đọc'
                                                            : 'Chưa đọc'}
                                                    </Tag>
                                                </div>
                                                <Divider />
                                                <Paragraph className="whitespace-pre-line">
                                                    {selectedNotify.message}
                                                </Paragraph>
                                                <Text type="secondary">
                                                    Ngày tạo:{' '}
                                                    {selectedNotify.createdAt
                                                        ? new Date(
                                                              selectedNotify.createdAt
                                                          ).toLocaleString()
                                                        : ''}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text>
                                                Chọn một thông báo để xem chi
                                                tiết.
                                            </Text>
                                        )}
                                    </Modal>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 rounded shadow-custom-light p-4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="roboto-bold">Lịch sử giao dịch</h3>
                            <RangePicker
                                format="YYYY-MM-DD"
                                onChange={(dates, dateStrings) => {
                                    setDateRange([
                                        dateStrings[0] || null,
                                        dateStrings[1] || null,
                                    ]);
                                }}
                            />
                        </div>
                        <TransactionChart transactions={transactions} />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <FooterPage />
            </div>
        </div>
    );
}

export default DashboardPage;
