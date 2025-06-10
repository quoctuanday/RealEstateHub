/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { forgotPassword } from '@/api/api';

interface IFormInput {
    email: string;
}

function ForgotPassPage() {
    const [form] = Form.useForm();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onFinish = async (values: IFormInput) => {
        try {
            const response = await forgotPassword(values);
            if (response) {
                message.success(
                    'Link thay đổi mật khẩu đã được gửi về email của bạn!'
                );
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                message.error('Tài khoản bạn đã nhập không tồn tại!');
            } else {
                message.error('Xác nhận thất bại!');
                console.error(error);
            }
        }
    };

    if (!isClient) return null;

    return (
        <div className="w-full h-[100vh] bg-gradient-to-br from-[#3AEEF1] to-[#1495AF] flex items-center justify-center">
            <div className="w-[700px] rounded-[25px] bg-[#E6F3FF] overflow-hidden">
                <Form
                    form={form}
                    layout="vertical"
                    className=" bg-white px-[3rem] py-[3rem]"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <h1 className="text-center roboto-bold text-2xl">
                        Quên mật khẩu
                    </h1>
                    <Form.Item
                        label="Tài khoản"
                        name="email"
                        className="mt-9"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="example@gmail.com" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-rootColor hover:bg-[#699ba3d9] text-white"
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassPage;
