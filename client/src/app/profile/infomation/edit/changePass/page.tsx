'use client';
import { changePassword } from '@/api/api';
import { Button, Form, FormProps, Input } from 'antd';
import React from 'react';
import toast from 'react-hot-toast';

type FieldType = {
    oldPassword?: string;
    password?: string;
    confirmPassword?: string;
};

function ChangePassPage() {
    const [form] = Form.useForm();
    const validateMessages = {
        required: 'Bạn chưa nhập trường này.',
    };

    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const sendData = async () => {
            try {
                const response = await changePassword(values);
                if (response) {
                    toast.success('Mật khẩu đã được thay đổi!');
                    form.resetFields();
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            toast.error('Sai mật khẩu!');
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
    return (
        <div>
            <h2 className="roboto-bold">Thay đổi mật khẩu</h2>
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                className="col-span-2 bg-white  px-[5rem] py-[3rem]"
                validateMessages={validateMessages}
            >
                <Form.Item<FieldType>
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        placeholder="Mật khẩu của bạn"
                        variant="filled"
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Mật khẩu mới"
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
                            pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/,
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
                                    new Error('Mật khẩu nhập lại không khớp!')
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

                <Form.Item label={null} className="my-4 flex justify-center">
                    <Button type="primary" htmlType="submit">
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ChangePassPage;
