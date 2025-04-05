'use client';
import { logout } from '@/api/api';
import { useUser } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    LuAlignEndHorizontal,
    LuBookUser,
    LuFile,
    LuList,
    LuLogOut,
} from 'react-icons/lu';
import { RiHome3Line } from 'react-icons/ri';

function SidebarAdmin() {
    const { userLoginData } = useUser();
    const pathName = usePathname();

    const [active, setActive] = useState(pathName);
    const handleClickPath = (path: string) => {
        setActive(path);
    };

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
    return (
        <div className="bg-white roboto-bold border-[1px] text-[1.1rem]  h-[100vh] px-3 pt-3">
            <Image
                src="/images/logo.png"
                alt=""
                width={300}
                height={300}
                className="w-[70px] h-[70px] scale-125"
            ></Image>
            <div className="mt-3">
                <h2 className="text-rootColor">Chức năng chính</h2>
                <ul className="mt-3">
                    {userLoginData?.role === 'admin' && (
                        <Link
                            href={'/admin/manageUsers'}
                            className={`${
                                active == '/admin/manageUsers' &&
                                'text-rootColor'
                            } hover:text-rootColor cursor-pointer flex items-center`}
                            onClick={() => {
                                handleClickPath('/admin/manageUsers');
                            }}
                        >
                            <LuBookUser className="pr-1" />
                            Quản lí tài khoản
                        </Link>
                    )}
                    <Link
                        href={'/admin/managePosts'}
                        className={`${
                            active == '/admin/managePosts' && 'text-rootColor'
                        } hover:text-rootColor mt-2 cursor-pointer flex items-center`}
                        onClick={() => {
                            handleClickPath('/admin/managePosts');
                        }}
                    >
                        <LuFile className="pr-1" />
                        Quản lí bài đăng
                    </Link>

                    <Link
                        href={'/admin/manageCate'}
                        className={`${
                            active == '/admin/manageCate' && 'text-rootColor'
                        } hover:text-rootColor mt-2 cursor-pointer flex items-center`}
                        onClick={() => {
                            handleClickPath('/admin/manageCate');
                        }}
                    >
                        <LuList className="pr-1" />
                        Quản lí danh mục
                    </Link>
                    <Link
                        href={'/admin'}
                        className={`${
                            active == '/admin' && 'text-rootColor'
                        } hover:text-rootColor mt-2 cursor-pointer flex items-center`}
                        onClick={() => {
                            handleClickPath('/admin');
                        }}
                    >
                        <LuAlignEndHorizontal className="pr-1" />
                        Thống kê
                    </Link>
                </ul>
                <h2 className="mt-3 text-rootColor">Thông tin tài khoản</h2>
                <ul className="mt-3">
                    <Link
                        href={'/home'}
                        className="hover:text-rootColor cursor-pointer flex items-center"
                    >
                        <RiHome3Line className="pr-1" />
                        Trang chủ
                    </Link>
                    <button
                        onClick={handleLogOut}
                        className="mt-2 hover:text-rootColor cursor-pointer flex items-center"
                    >
                        <LuLogOut className="pr-1" />
                        Đăng xuất
                    </button>
                </ul>
                <div className="flex items-center mt-3">
                    <Image
                        src={
                            userLoginData?.image
                                ? userLoginData.image
                                : '/images/avatar-trang.jpg'
                        }
                        alt=""
                        width={100}
                        height={100}
                        className="rounded-full w-[3.5rem]"
                    ></Image>
                    <div className="ml-2">
                        <p className="">{userLoginData?.userName}</p>
                        {userLoginData?.role === 'admin' && (
                            <p className="text-[0.9rem] roboto-regular">
                                Quản trị viên
                            </p>
                        )}
                        {userLoginData?.role === 'moderator' && (
                            <p className="text-[0.9rem] roboto-regular">
                                Người kiểm duyệt
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    );
}

export default SidebarAdmin;
