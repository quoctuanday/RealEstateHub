'use client';
import { getNotify, getPost, updateNotify } from '@/api/api';
import FooterPage from '@/components/footer';
import TitleComponent from '@/components/title';
import { Notify } from '@/schema/notification';
import { useUser } from '@/store/store';
import { Spin, Tag, Divider, Typography, Modal } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsFillPostcardFill } from 'react-icons/bs';
import { FaCoins } from 'react-icons/fa';
const { Title, Paragraph, Text } = Typography;

function DashboardPage() {
    const { userLoginData } = useUser();
    const [pending, setPending] = useState(0);
    const [active, setActive] = useState(0);
    const [isCheckout, setIsCheckout] = useState(0);
    const [notify, setNotify] = useState<Notify[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNotify, setSelectedNotify] = useState<Notify | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

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
                status: ['pending', 'active'],
                isCheckout: false,
            };
            const response = await getPost(query);
            if (response) {
                const { counts } = response.data;
                setPending(counts['status:pending']);
                setActive(counts['status:active']);
                setIsCheckout(counts['isCheckout:false']);
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

    return (
        <div className="mt-[1.25rem]">
            <TitleComponent title="Tổng quan" />
            <div className="px-[8rem] mt-[1.25rem]">
                <h1 className="roboto-bold">Thống kê</h1>
                <div className="grid grid-cols-3 gap-4 h-[8rem] mt-3">
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
                    <div className="col-span-1 rounded shadow-custom-light p-2">
                        <div className="flex items-center">
                            <i>
                                <BsFillPostcardFill />
                            </i>
                            <h2 className="roboto-bold ml-2">Tin đăng</h2>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="col-span-1 flex flex-col items-center">
                                <div className="">{active}</div>
                                <p className="text-gray-400 mt-2">
                                    Đang hiển thị
                                </p>
                            </div>
                            <div className="ml-2col-span-1 flex flex-col items-center">
                                <div className="">{pending}</div>
                                <p className="text-gray-400 mt-2">
                                    Đang chờ duyệt
                                </p>
                            </div>
                            <div className="ml-2col-span-1 flex flex-col items-center">
                                <div className="">{isCheckout}</div>
                                <p className="text-gray-400 mt-2">
                                    Chờ thanh toán
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className="roboto-bold mt-[1.25rem]">Thông tin</h1>
                <div className="grid grid-cols-3 gap-4 w-full mt-3">
                    <div className="pt-2 col-span-1 min-h-[15rem] shadow-custom-light flex flex-col">
                        <div className="flex items-center px-2">
                            <h3 className="roboto-bold flex-1">Thông báo</h3>
                        </div>
                        <div className="flex-1 flex overflow-hidden mt-2 rounded border border-gray-200">
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
                                    <ul className="w-full max-h-[20rem] overflow-y-auto border-r border-gray-200">
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
                </div>
            </div>
            <div className="mt-10">
                <FooterPage />
            </div>
        </div>
    );
}

export default DashboardPage;
