'use client';
import { getUser } from '@/api/api';
import { useUser } from '@/store/store';
import Image from 'next/image';
import React, { useEffect } from 'react';
import dateConvert from '@/utils/convertDate';
import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';

function InfomationPage() {
    const { socket, userLoginData, setUserLoginData } = useUser();
    const router = useRouter();
    useEffect(() => {
        const getData = async () => {
            const response = await getUser();
            if (response) {
                setUserLoginData(response.data);
            }
        };
        getData();
        if (!socket) return;
        socket.on('user-update', () => {
            console.log('User updated');
            getData();
        });
    }, [socket, setUserLoginData]);
    return (
        <>
            <h1 className="roboto-bold text-[1.25rem]">Thông tin cá nhân</h1>
            <div className="flex items-center justify-center mt-[1.25rem]">
                <Image
                    src={
                        userLoginData?.image
                            ? userLoginData?.image
                            : '/images/avatar-trang.jpg'
                    }
                    alt="avatar"
                    width={200}
                    height={200}
                    className="w-[8rem] h-[8rem] rounded-full"
                ></Image>
            </div>
            <div className="flex mt-[1.25rem]">
                <h2 className="roboto-bold">Tên người dùng:</h2>
                <span className="ml-1">{userLoginData?.userName}.</span>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex ">
                    <h2 className="roboto-bold">Ngày sinh:</h2>
                    <span className="ml-1">
                        {userLoginData?.DOB
                            ? dateConvert(userLoginData?.DOB)
                            : 'Chưa đặt thời gian.'}
                    </span>
                </div>
                <div className="flex">
                    <h2 className="roboto-bold">Giới tính:</h2>
                    <span className="ml-1">
                        {userLoginData?.gender
                            ? userLoginData.gender
                            : 'Chưa đặt giới tính.'}
                    </span>
                </div>
            </div>
            <div className="col-start-4 flex mt-2 border-b pb-[1.25rem]">
                <h2 className="roboto-bold">Số dư tài khoản:</h2>
                <span className="ml-1">
                    {userLoginData?.accountBalance?.toLocaleString('vi-VN')}{' '}
                    VND.
                </span>
            </div>
            <h1 className="roboto-bold text-[1.25rem] mt-[1.25rem]">
                Thông tin liên hệ
            </h1>
            <div className="mt-2">
                <div>
                    <i className="roboto-bold flex items-center">Email:</i>
                    <Input
                        readOnly
                        className="mt-1"
                        value={userLoginData?.email}
                    ></Input>
                </div>
                <div className="mt-3">
                    <i className="roboto-bold flex items-center">
                        Số điện thoại:
                    </i>
                    <Input
                        readOnly
                        className="mt-1"
                        value={
                            userLoginData?.phoneNumber
                                ? userLoginData.phoneNumber
                                : 'Chưa đặt số điện thoại.'
                        }
                    ></Input>
                </div>
            </div>
            <Button
                type="primary"
                onClick={() => router.push('/profile/infomation/edit')}
                className="mt-[1.25rem]"
            >
                Chỉnh sửa thông tin
            </Button>
        </>
    );
}

export default InfomationPage;
