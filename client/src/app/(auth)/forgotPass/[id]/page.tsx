'use client';
import { resetPassword } from '@/api/api';
import { Button, Form, Input, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { TfiReload } from 'react-icons/tfi';

interface IFormInput {
    password: string;
    passwordConfirm: string;
}

function ResetPassPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [form] = Form.useForm<IFormInput>();
    const [captcha, setCaptcha] = useState('');
    const [isRotating, setIsRotating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const onFinish = async (values: IFormInput) => {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        if (inputRef.current?.value !== captcha) {
            message.error('Captcha không chính xác. Vui lòng thử lại.');
            return;
        }

        try {
            await resetPassword(id, values);
            message.success('Thay đổi mật khẩu thành công!');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err) {
            message.error('Đã xảy ra lỗi khi đặt lại mật khẩu.');
            console.error(err);
        }
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-br from-[#3AEEF1] to-[#1495AF] flex items-center justify-center">
            <div className="w-[700px] rounded-[25px] bg-[#E6F3FF] overflow-hidden">
                <Form
                    className=" bg-white px-[3rem] py-[3rem]"
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <h2 className="text-center roboto-bold text-2xl">
                        Thay đổi mật khẩu
                    </h2>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới',
                            },
                            {
                                pattern:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                message:
                                    'Ít nhất 8 kí tự, bao gồm hoa, thường, số, và ký tự đặc biệt.',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="passwordConfirm"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu',
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
                                        'Mật khẩu không khớp'
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                    </Form.Item>

                    <div className="mb-4">
                        <div className="border-2 border-dotted w-full h-[5rem] mb-2">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                width="200"
                                height="50"
                            />
                        </div>
                        <div className="flex">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Nhập mã captcha"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded-l-md text-center"
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setIsRotating(true);
                                    drawCaptcha();
                                    setTimeout(() => setIsRotating(false), 500);
                                }}
                                className="rounded-l-none"
                            >
                                <TfiReload
                                    className={isRotating ? 'animate-spin' : ''}
                                />
                            </Button>
                        </div>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                    <Link
                        href={'/login'}
                        className="hover:underline hover:text-blue-400"
                    >
                        Quay lại trang đăng nhập.
                    </Link>
                </Form>
            </div>
        </div>
    );
}

export default ResetPassPage;
