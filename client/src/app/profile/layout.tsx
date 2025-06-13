'use client';
import { logout } from '@/api/api';
import { useUser } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CiLock, CiViewList } from 'react-icons/ci';
import { GoPerson } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';
import { IoIosLogOut } from 'react-icons/io';
import { IoPieChartOutline } from 'react-icons/io5';
import { LuHandCoins } from 'react-icons/lu';

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userLoginData } = useUser();
    const router = useRouter();
    const handleLogOut = () => {
        const logOut = async () => {
            try {
                const response = await logout();
                if (response) {
                    sessionStorage.clear();
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
        <div className="">
            <div className="fixed top-0 left-0 bottom-0 w-[100px] shadow-custom-medium flex flex-col justify-start items-center">
                <Link href={'/home'} className="overflow-hidden mt-[1rem]">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={200}
                        height={200}
                        className="w-[70px] h-[70px] scale-125"
                    ></Image>
                </Link>
                <ul>
                    <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer">
                        <Link
                            href={'/profile/dashboard'}
                            className="flex flex-col items-center hover:text-rootColor "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <IoPieChartOutline />
                            </i>{' '}
                            <span className="">Tổng quan</span>
                        </Link>
                    </li>
                    <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer">
                        <Link
                            href={'/profile/infomation'}
                            className="flex flex-col items-center hover:text-rootColor "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <GoPerson />
                            </i>{' '}
                            <span className="">TK cá nhân</span>
                        </Link>
                    </li>
                    <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer">
                        <Link
                            href={'/profile/infomation/edit/changePass'}
                            className="flex flex-col items-center hover:text-rootColor "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <CiLock />
                            </i>{' '}
                            <span className="">Thay đổi mật khẩu</span>
                        </Link>
                    </li>
                    <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer">
                        <Link
                            href={'/profile/managePost'}
                            className="flex flex-col items-center hover:text-rootColor "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <CiViewList />
                            </i>{' '}
                            <span className="">Tin đăng</span>
                        </Link>
                    </li>
                    <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer border-b">
                        <Link
                            href={'/profile/recharge'}
                            className="flex flex-col items-center hover:text-rootColor "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <LuHandCoins />
                            </i>{' '}
                            <span className="">Nạp tiền</span>
                        </Link>
                    </li>
                    {(userLoginData?.role === 'admin' ||
                        userLoginData?.role === 'moderator') && (
                        <li className="px-2 text-center py-2 hover:bg-hoverColor cursor-pointer border-b">
                            <Link
                                href={
                                    userLoginData.role === 'admin'
                                        ? '/admin/manageUsers'
                                        : '/admin/managePosts'
                                }
                                className="flex flex-col items-center hover:text-rootColor "
                            >
                                <i className="text-[1.25rem] roboto-bold">
                                    <GrUserAdmin />
                                </i>{' '}
                                <span className="">Admin</span>
                            </Link>
                        </li>
                    )}
                    <li className="px-2 text-center hover:text-rootColor py-2 hover:bg-hoverColor cursor-pointer">
                        <button
                            onClick={() => handleLogOut()}
                            className="flex flex-col items-center "
                        >
                            <i className="text-[1.25rem] roboto-bold">
                                <IoIosLogOut />
                            </i>{' '}
                            <span className="">Đăng xuất </span>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="ml-[100px]">{children}</div>
        </div>
    );
}
