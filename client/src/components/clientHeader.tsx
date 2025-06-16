'use client';

import { useEffect, useState } from 'react';
import { getUser, getFavourite, getNotify, logout } from '@/api/api';
import { useUser } from '@/store/store';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ModalFavorite from '@/components/modalFavourite';
import ModalNotification from '@/components/modalNotification';
import { FaRegBell, FaRegHeart } from 'react-icons/fa';
import { IoIosArrowDown, IoIosLogOut } from 'react-icons/io';
import { IoPieChartOutline } from 'react-icons/io5';
import { GoPerson } from 'react-icons/go';
import { CiLock, CiViewList } from 'react-icons/ci';
import { LuHandCoins } from 'react-icons/lu';
import { GrUserAdmin } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { Button } from 'antd';
import { Notify } from '@/schema/notification';
import { Post } from '@/schema/Post';

export default function ClientHeader() {
    const { userLoginData, setUserLoginData, socket } = useUser();
    const router = useRouter();
    const pathName = usePathname();
    const [active, setActive] = useState(pathName);
    const [favorites, setFavorites] = useState<Post[]>([]);
    const [notifications, setNotifications] = useState<Notify[]>([]);
    const [openFavoriteModal, setOpenFavoriteModal] = useState(false);
    const [openNotificationModal, setOpenNotificationModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchData = async () => {
            try {
                const userRes = await getUser();
                if (userRes) {
                    localStorage.setItem(
                        'userLoginData',
                        JSON.stringify(userRes.data)
                    );
                    setUserLoginData(userRes.data);
                }
                const favRes = await getFavourite();
                if (favRes?.data?.favorites)
                    setFavorites(favRes.data.favorites);

                const notifyRes = await getNotify();
                if (notifyRes?.data?.notify)
                    setNotifications(notifyRes.data.notify);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchFavouritesOnly = async () => {
            try {
                const favRes = await getFavourite();
                if (favRes?.data?.favorites)
                    setFavorites(favRes.data.favorites);
            } catch (error) {
                console.error('Lỗi khi fetch favourite:', error);
            }
        };

        fetchData();

        if (socket) {
            socket.on('favouritePost-update', fetchFavouritesOnly);
            return () => {
                socket.off('favouritePost-update', fetchFavouritesOnly);
            };
        }
    }, [setUserLoginData, socket]);

    const handleLogOut = async () => {
        try {
            const res = await logout();
            if (res) {
                localStorage.clear();
                toast.success('Đã đăng xuất');
                setTimeout(() => router.push('/login'), 2000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickPath = (path: string) => {
        setActive(path);
    };

    return (
        <div className="px-[30px] py-3 h-[90px] flex items-center justify-between shadow-custom-light">
            <div className="flex items-center">
                <Link href="/home" className="overflow-hidden h-full">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={200}
                        height={200}
                        className="w-[90px] h-[90px] scale-125"
                    />
                </Link>
                <Link
                    href="/sell"
                    className={`${
                        active === '/sell' && 'active'
                    } nav-link ml-6`}
                    onClick={() => handleClickPath('/sell')}
                >
                    Mua bán
                </Link>
                <Link
                    href="/rent"
                    className={`${
                        active === '/rent' && 'active'
                    } nav-link ml-6`}
                    onClick={() => handleClickPath('/rent')}
                >
                    Cho thuê
                </Link>
                <Link
                    href="/news"
                    className={`${
                        active === '/news' && 'active'
                    } nav-link ml-6`}
                    onClick={() => handleClickPath('/news')}
                >
                    Tin tức
                </Link>
                <Link
                    href="/legalDocuments"
                    className={`${
                        active === '/legalDocuments' && 'active'
                    } nav-link ml-6`}
                    onClick={() => handleClickPath('/legalDocuments')}
                >
                    Văn bản pháp luật
                </Link>
            </div>

            <ModalFavorite
                open={openFavoriteModal}
                onClose={() => setOpenFavoriteModal(false)}
                favorites={favorites}
            />
            <ModalNotification
                open={openNotificationModal}
                onClose={() => setOpenNotificationModal(false)}
                notifications={notifications}
            />

            {userLoginData ? (
                <div className="flex items-center relative">
                    <i
                        className="cursor-pointer"
                        onClick={() => setOpenNotificationModal(true)}
                    >
                        <FaRegBell />
                    </i>
                    <i
                        className="ml-3 cursor-pointer"
                        onClick={() => setOpenFavoriteModal(true)}
                    >
                        <FaRegHeart />
                    </i>
                    <div className="flex items-center relative parent ml-5">
                        <Image
                            src={
                                userLoginData.image ||
                                '/images/avatar-trang.jpg'
                            }
                            alt="avatar"
                            width={200}
                            height={200}
                            className="w-[50px] h-[50px] rounded-full"
                        />
                        <span className="ml-2">{userLoginData.userName}</span>
                        <i className="ml-1 text-[20px]">
                            <IoIosArrowDown />
                        </i>
                        <div className="absolute z-30 bg-white children appear hidden w-[300px] right-0 top-[120%] rounded border shadow-custom-light">
                            <ul>
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <Link
                                        href="/profile/dashboard"
                                        className="flex items-center"
                                    >
                                        <IoPieChartOutline />{' '}
                                        <span className="ml-2">Tổng quan</span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <Link
                                        href="/profile/infomation"
                                        className="flex items-center"
                                    >
                                        <GoPerson />{' '}
                                        <span className="ml-2">
                                            Thông tin cá nhân
                                        </span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <Link
                                        href="/profile/infomation/edit/changePass"
                                        className="flex items-center"
                                    >
                                        <CiLock />{' '}
                                        <span className="ml-2">
                                            Thay đổi mật khẩu
                                        </span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <Link
                                        href="/profile/managePost"
                                        className="flex items-center"
                                    >
                                        <CiViewList />{' '}
                                        <span className="ml-2">
                                            Quản lí bài đăng
                                        </span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <Link
                                        href="/profile/recharge"
                                        className="flex items-center"
                                    >
                                        <LuHandCoins />{' '}
                                        <span className="ml-2">Nạp tiền</span>
                                    </Link>
                                </li>
                                {(userLoginData.role === 'admin' ||
                                    userLoginData.role === 'moderator') && (
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer border-b">
                                        <Link
                                            href={
                                                userLoginData.role === 'admin'
                                                    ? '/admin/manageUsers'
                                                    : '/admin/managePosts'
                                            }
                                            className="flex items-center"
                                        >
                                            <GrUserAdmin />{' '}
                                            <span className="ml-2">Admin</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                    <button
                                        onClick={handleLogOut}
                                        className="flex items-center"
                                    >
                                        <IoIosLogOut />{' '}
                                        <span className="ml-2">Đăng xuất</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Button
                        className="ml-2"
                        onClick={() => router.push('/post')}
                    >
                        Đăng tin
                    </Button>
                </div>
            ) : (
                <div className="flex items-center">
                    <Link className="mr-2 hover:underline" href="/login">
                        Đăng nhập
                    </Link>
                    <Link className="mr-2 hover:underline" href="/register">
                        Đăng ký
                    </Link>
                    <i className="text-[25px]">
                        <CgProfile />
                    </i>
                </div>
            )}
        </div>
    );
}
