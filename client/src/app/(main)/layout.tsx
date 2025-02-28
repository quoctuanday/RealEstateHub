'use client';
import { getUser, logout } from '@/api/api';
import { useUser } from '@/store/store';
import '@ant-design/v5-patch-for-react-19';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { CgProfile } from 'react-icons/cg';
import { CiLock, CiViewList } from 'react-icons/ci';
import { FaBell, FaHeart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';
import { IoIosArrowDown, IoIosLogOut } from 'react-icons/io';
import { IoPieChartOutline } from 'react-icons/io5';
import { LuHandCoins } from 'react-icons/lu';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userLoginData, setUserLoginData } = useUser();
    const router = useRouter();
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
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await getUser();
                    if (response) {
                        console.log(response.data);
                        const userData = JSON.stringify(response.data);
                        localStorage.setItem('userLoginData', userData);
                        const storedUser =
                            localStorage.getItem('userLoginData');
                        if (storedUser) {
                            setUserLoginData(JSON.parse(storedUser));
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [setUserLoginData]);

    return (
        <>
            <div className="px-[30px] h-[90px] flex items-center justify-between">
                <i className="overflow-hidden h-full">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={200}
                        height={200}
                        className="w-[90px] h-[90px] scale-125"
                    ></Image>
                </i>
                {userLoginData ? (
                    <div className="flex items-center relative">
                        <i className="text-[#918725] cursor-pointer">
                            <FaBell />
                        </i>
                        <i className="ml-3 text-[#f64747] cursor-pointer">
                            <FaHeart />
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
                            <div className="absolute children hidden w-[300px] right-0 top-[120%] rounded border shadow-custom-light">
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
                                            href={'#'}
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
                                            href={'#'}
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
                                    <li className="px-4 py-2 hover:bg-hoverColor cursor-pointer border-b">
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
                        <Button className="ml-2">Đăng tin</Button>
                    </div>
                ) : (
                    <i className="text-[25px]">
                        <CgProfile />
                    </i>
                )}
            </div>
            <div className="">{children}</div>
        </>
    );
}
