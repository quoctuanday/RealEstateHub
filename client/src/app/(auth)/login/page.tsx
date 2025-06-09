/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Input, Form, FormProps, Button } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { login } from '@/api/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

type FieldType = {
    email?: string;
    password?: string;
};

function LoginPage() {
    const router = useRouter();
    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const sendData = async () => {
            try {
                const response = await login(values);
                if (response) {
                    toast.success('Đăng nhập thành công!');
                    localStorage.setItem('token', response.data.accessToken);
                    setTimeout(() => {
                        router.push('/home');
                    }, 2000);
                }
            } catch (error: any) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            toast.error('Sai tài khoản hoặc mật khẩu!');
                            break;
                        case 500:
                            toast.error('Lỗi máy chủ, vui lòng thử lại sau!');
                            break;
                        default:
                            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
                            break;
                    }
                } else {
                    toast.error('Không thể kết nối đến máy chủ!');
                }
            }
        };
        sendData();
    };

    const validateMessages = {
        required: 'Bạn chưa nhập ${label}',
        types: {
            email: '${label} Không hợp lệ!',
        },
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/google';
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-br from-[#3AEEF1] to-[#1495AF] flex items-center justify-center">
            <div className="grid grid-cols-3 w-[880px] rounded-[25px] bg-[#E6F3FF] overflow-hidden">
                <Image
                    src={'/images/sky.jpg'}
                    alt="ảnh bầu trời"
                    width={400}
                    height={400}
                    className="col-span-1 w-full h-full object-cover object-left "
                ></Image>
                <Form
                    onFinish={handleFinish}
                    layout="vertical"
                    className="col-span-2 bg-white px-[5rem] py-[3rem]"
                    validateMessages={validateMessages}
                >
                    <h1 className="text-center roboto-bold text-2xl">
                        Đăng nhập
                    </h1>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        className="mt-9"
                        rules={[{ type: 'email', required: true }]}
                    >
                        <Input
                            placeholder="example@gmail.com"
                            variant="filled"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        className="mb-0"
                        rules={[{ required: true }]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu của bạn"
                            variant="filled"
                        />
                    </Form.Item>
                    <Link href={'/forgotPass'} className="hover:underline">
                        Quên mật khẩu?
                    </Link>
                    <Form.Item
                        label={null}
                        className="my-4 flex justify-center"
                    >
                        <Button type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500">Hoặc</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button
                            htmlType="button"
                            onClick={() => {
                                handleGoogleLogin();
                            }}
                        >
                            <div className="flex items-center justify-center">
                                <FcGoogle className="" />{' '}
                                <span className="ml-2">
                                    Đăng nhập bằng Google
                                </span>
                            </div>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>
                            Đã có tài khoản?{' '}
                            <Link
                                href={'/register'}
                                className="hover:underline"
                            >
                                Đăng ký ngay.
                            </Link>
                        </span>
                        <Link
                            href="/home"
                            className="hover:underline text-blue-400"
                        >
                            Ghé thăm với tư cách khách.
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
