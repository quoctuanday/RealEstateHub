'use client';
import { getNotify, getPost, updateNotify } from '@/api/api';
import FooterPage from '@/components/footer';
import TitleComponent from '@/components/title';
import { Notify } from '@/schema/notification';
import { useUser } from '@/store/store';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Popover, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsFillPostcardFill } from 'react-icons/bs';
import { FaCoins, FaRegBell } from 'react-icons/fa';

function DashboardPage() {
    const { userLoginData } = useUser();
    const [pending, setPending] = useState(0);
    const [active, setActive] = useState(0);
    const [isCheckout, setIsCheckout] = useState(0);
    const [notify, setNotify] = useState<Notify[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNotify, setSelectedNotify] = useState<Notify | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const handleOpen = async (item: Notify) => {
        const response = await updateNotify(item._id, { isRead: true });

        if (response) {
            setNotify((prev) =>
                prev
                    ? prev.map((noti) =>
                          noti._id === item._id
                              ? { ...noti, isRead: true }
                              : noti
                      )
                    : null
            );

            setSelectedNotify({ ...item, isRead: true });
            setVisible(true);
        }
    };

    const handleClose = () => {
        setVisible(false);
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
                    <div className="pt-2  col-span-1 min-h-[15rem] shadow-custom-light">
                        <div className="flex items-center">
                            <h3 className="roboto-bold pl-2">Thông báo</h3>
                            <i className="ml-2">
                                <FaRegBell />
                            </i>
                        </div>
                        <div className="w-full h-full mt-2">
                            {loading ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    <Spin size="large" />
                                </div>
                            ) : notify && notify.length > 0 ? (
                                <ul>
                                    {notify.map((item, index) => (
                                        <Popover
                                            key={index}
                                            content={
                                                selectedNotify && (
                                                    <div className="w-72">
                                                        <div className="flex justify-between items-center">
                                                            <h2 className="font-bold">
                                                                {
                                                                    selectedNotify.title
                                                                }
                                                            </h2>
                                                            <Button
                                                                type="text"
                                                                icon={
                                                                    <CloseOutlined />
                                                                }
                                                                onClick={
                                                                    handleClose
                                                                }
                                                            />
                                                        </div>
                                                        <p className="mt-2">
                                                            {
                                                                selectedNotify.message
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            trigger="click"
                                            open={
                                                visible &&
                                                selectedNotify?._id === item._id
                                            }
                                            placement="right"
                                        >
                                            <li
                                                key={index}
                                                className="py-2 cursor-pointer px-2 hover:bg-gray-100"
                                                onClick={() => handleOpen(item)}
                                            >
                                                <h2 className="roboto-bold">
                                                    {item.title}
                                                </h2>
                                                <span className="line-clamp-2 py-1">
                                                    {item.message}
                                                </span>
                                                <div className="flex items-center justify-between">
                                                    <span>
                                                        {item.createdAt
                                                            ? new Date(
                                                                  item.createdAt
                                                              ).toLocaleString(
                                                                  'vi-VN',
                                                                  {
                                                                      hour: '2-digit',
                                                                      minute: '2-digit',
                                                                      day: '2-digit',
                                                                      month: '2-digit',
                                                                      year: 'numeric',
                                                                  }
                                                              )
                                                            : ''}
                                                    </span>
                                                    <span className="text-gray-300">
                                                        {item.isRead
                                                            ? 'Đã đọc'
                                                            : 'Chưa đọc'}
                                                    </span>
                                                </div>
                                            </li>
                                        </Popover>
                                    ))}
                                </ul>
                            ) : (
                                'Chưa có thông báo!'
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
