/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Form, FormProps, Input } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { createUser } from '@/api/api';
import toast from 'react-hot-toast';
import { TfiReload } from 'react-icons/tfi';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

type FieldType = {
    userName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};
function RegisterPage() {
    const router = useRouter();
    const [isRoting, setIsRoting] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    const drawCaptcha = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const captchaText = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
        setCaptcha(captchaText);
        console.log('Captcha:', captchaText);

        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(captchaText, 50, 35);

        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.lineTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.strokeStyle = '#ccc';
            ctx.stroke();
        }
    };

    useEffect(() => {
        drawCaptcha();
    }, []);

    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (inputRef.current?.value !== captcha) {
            setError('Captcha không hợp lệ. Mời nhập lại!');
            return;
        }
        const sendData = async () => {
            try {
                const response = await createUser(values);
                console.log(response.status);
                if (response) {
                    toast.success('Đăng ký thành công!');
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } catch (error: any) {
                console.log(error);
                if (error.response) {
                    switch (error.response.status) {
                        case 409:
                            toast.error('Tài khoản đã tồn tại!');
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
        required: 'Bạn chưa nhập trường này.',
        types: {
            email: '${label} không hợp lệ!',
        },
    };
    return (
        <div className="w-full h-[100vh] bg-gradient-to-br from-[#3AEEF1] to-[#1495AF] flex items-center justify-center">
            <div className=" w-[700px] rounded-[25px] bg-[#E6F3FF] overflow-hidden">
                <Form
                    onFinish={handleFinish}
                    layout="vertical"
                    className=" bg-white  px-[3rem] py-[1rem]"
                    validateMessages={validateMessages}
                >
                    <h1 className="text-center roboto-bold text-2xl">
                        Đăng ký
                    </h1>
                    <Form.Item<FieldType>
                        label="Tên đăng nhập"
                        name="userName"
                        className="mt-9 mb-0"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Nguyễn Văn A" variant="filled" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phoneNumber"
                        className="mt-2 mb-0"
                        rules={[
                            { required: true },
                            {
                                min: 9,
                                message: 'Số điện thoại phải có ít nhất 9 số.',
                            },
                        ]}
                    >
                        <Input placeholder="090*******" variant="filled" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        className="mt-2 mb-0"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input
                            placeholder="example@gmail.com"
                            variant="filled"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        className="mb-0 mt-2"
                        rules={[
                            {
                                required: true,
                                message: 'Bạn chưa nhập mật khẩu!',
                            },
                            {
                                min: 8,
                                message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                            },
                            {
                                pattern:
                                    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/,
                                message:
                                    'Mật khẩu phải chứa chữ, số và ký tự đặc biệt!',
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu của bạn"
                            variant="filled"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        className="mb-0 mt-2"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'Mật khẩu nhập lại không khớp!'
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu"
                            variant="filled"
                        />
                    </Form.Item>
                    <div className="mt-3">
                        <div className="border-2 border-dotted w-full h-[5rem]">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                width="200"
                                height="50"
                            ></canvas>
                        </div>
                        <div className="flex w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Xin hãy nhập captcha"
                                className="px-2 py-1 border-black border w-full text-center"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRoting(true);
                                    drawCaptcha();
                                    setTimeout(() => {
                                        setIsRoting(false);
                                    }, 1000);
                                }}
                                className="px-2 py-1 text-white bg-blue-500 h-"
                            >
                                <TfiReload
                                    className={`${isRoting ? 'spin' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}

                    <Form.Item
                        label={null}
                        className="my-4 flex justify-center"
                    >
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <span>
                        Đã có tài khoản?{' '}
                        <Link href={'/login'} className="hover:underline">
                            Đăng nhập tại đây!
                        </Link>
                    </span>
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;
