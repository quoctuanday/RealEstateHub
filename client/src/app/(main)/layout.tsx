'use client';
import { getFavourite, getNotify, getUser, logout } from '@/api/api';
import DraggableChatbot from '@/components/draggableChatBot';
import FooterPage from '@/components/footer';
import ModalFavorite from '@/components/modalFavourite';
import ModalNotification from '@/components/modalNotification';
import { Notify } from '@/schema/notification';
import { Post } from '@/schema/Post';
import { useUser } from '@/store/store';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgProfile } from 'react-icons/cg';
import { CiLock, CiViewList } from 'react-icons/ci';
import { FaRegBell, FaRegHeart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';
import { IoIosArrowDown, IoIosLogOut } from 'react-icons/io';
import { IoPieChartOutline } from 'react-icons/io5';
import { LuHandCoins } from 'react-icons/lu';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userLoginData, setUserLoginData, socket } = useUser();
    const pathName = usePathname();
    const [active, setActive] = useState(pathName);
    const router = useRouter();
    const [openFavoriteModal, setOpenFavoriteModal] = useState(false);
    const [openNotificationModal, setOpenNotificationModal] = useState(false);

    const [favorites, setFavorites] = useState<Post[]>([]);
    const [notifications, setNotifications] = useState<Notify[]>([]);

    const handleClickPath = (path: string) => {
        setActive(path);
    };

    const handleLogOut = () => {
        const logOut = async () => {
            try {
                const response = await logout();
                if (response) {
                    localStorage.clear();
                    toast.success('Đã đăng xuất');
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } catch (error) {
                console.log(error);
            }
        };
        logOut();
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchInitialData = async () => {
            try {
                const response = await getUser();
                if (response) {
                    const userData = JSON.stringify(response.data);
                    localStorage.setItem('userLoginData', userData);
                    const storedUser = localStorage.getItem('userLoginData');
                    if (storedUser) {
                        setUserLoginData(JSON.parse(storedUser));
                    }
                }

                const favRes = await getFavourite();
                if (favRes?.data?.favorites) {
                    setFavorites(favRes.data.favorites);
                }

                const notifyRes = await getNotify();
                if (notifyRes.data.notify) {
                    setNotifications(notifyRes.data.notify);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchFavouritesOnly = async () => {
            try {
                const favRes = await getFavourite();
                if (favRes?.data?.favorites) {
                    setFavorites(favRes.data.favorites);
                }
            } catch (error) {
                console.error('Lỗi khi fetch favourite:', error);
            }
        };

        fetchInitialData();

        if (socket) {
            socket.on('favouritePost-update', fetchFavouritesOnly);

            return () => {
                socket.off('favouritePost-update', fetchFavouritesOnly);
            };
        }
    }, [setUserLoginData, socket]);

    return (
        <>
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
                        href={'/sell'}
                        className={`${
                            active == '/sell' && 'active'
                        } nav-link ml-6`}
                        onClick={() => {
                            handleClickPath('/sell');
                        }}
                    >
                        Mua bán
                    </Link>
                    <Link
                        href={'/rent'}
                        className={`${
                            active == '/rent' && 'active'
                        } nav-link ml-6`}
                        onClick={() => {
                            handleClickPath('/rent');
                        }}
                    >
                        Cho thuê
                    </Link>
                    <Link
                        href={'/news'}
                        className={`${
                            active == '/news' && 'active'
                        } nav-link ml-6`}
                        onClick={() => {
                            handleClickPath('/news');
                        }}
                    >
                        Tin tức
                    </Link>
                    <Link
                        href={'/legalDocuments'}
                        className={`${active == '#' && 'active'} nav-link ml-6`}
                        onClick={() => {
                            handleClickPath('#');
                        }}
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
                                    userLoginData.image
                                        ? userLoginData.image
                                        : '/images/avatar-trang.jpg'
                                }
                                alt="avatar"
                                width={200}
                                height={200}
                                className="w-[50px] h-[50px] rounded-full"
                            ></Image>
                            <span className="ml-2">
                                {userLoginData.userName}
                            </span>
                            <i className="ml-1 text-[20px]">
                                <IoIosArrowDown />
                            </i>
                            <div className="absolute z-30 bg-white children appear hidden w-[300px] right-0 top-[120%] rounded border shadow-custom-light">
                                <ul>
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                        <Link
                                            href={'/profile/dashboard'}
                                            className="flex items-center "
                                        >
                                            <i>
                                                <IoPieChartOutline />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Tổng quan
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                        <Link
                                            href={'/profile/infomation'}
                                            className="flex items-center "
                                        >
                                            <i>
                                                <GoPerson />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Thông tin cá nhân
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                        <Link
                                            href={
                                                '/profile/infomation/edit/changePass'
                                            }
                                            className="flex items-center "
                                        >
                                            <i>
                                                <CiLock />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Thay đổi mật khẩu
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                        <Link
                                            href={'/profile/managePost'}
                                            className="flex items-center "
                                        >
                                            <i>
                                                <CiViewList />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Quản lí bài đăng
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer ">
                                        <Link
                                            href={'/profile/recharge'}
                                            className="flex items-center "
                                        >
                                            <i>
                                                <LuHandCoins />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Nạp tiền
                                            </span>
                                        </Link>
                                    </li>
                                    {userLoginData.role === 'admin' && (
                                        <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer border-b">
                                            <Link
                                                href={'/admin/manageUsers'}
                                                className="flex items-center "
                                            >
                                                <i>
                                                    <GrUserAdmin />
                                                </i>{' '}
                                                <span className="ml-2">
                                                    Admin
                                                </span>
                                            </Link>
                                        </li>
                                    )}
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer">
                                        <button
                                            onClick={() => handleLogOut()}
                                            className="flex items-center "
                                        >
                                            <i>
                                                <IoIosLogOut />
                                            </i>{' '}
                                            <span className="ml-2">
                                                Đăng xuất
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Button
                            className="ml-2"
                            htmlType="button"
                            onClick={() => {
                                router.push('/post');
                            }}
                        >
                            Đăng tin
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <Link className="mr-2 hover:underline" href={'/login'}>
                            Đăng nhập
                        </Link>
                        <Link
                            className="mr-2 hover:underline"
                            href={'/register'}
                        >
                            Đăng ký
                        </Link>
                        <i className="text-[25px]">
                            <CgProfile />
                        </i>
                    </div>
                )}
            </div>
            <div className="">
                {children}
                <DraggableChatbot />
            </div>
            <div className="w-full h-[10rem]"></div>
            <FooterPage />
        </>
    );
}
