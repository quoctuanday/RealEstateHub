'use client';
import TitleComponent from '@/components/title';
import { Button, Form, FormProps, Radio } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Post } from '@/schema/Post';
import MyAddressInput from '@/components/addressInput';

interface Location {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

function PostPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [location, setLocation] = useState<Location | null>(null);

    const handleFinish: FormProps<Post>['onFinish'] = (values) => {
        form.setFieldValue('location', location);
        console.log(values);
    };
    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            className="p-[1.25rem]"
        >
            <TitleComponent title="Tạo tin đăng" />
            <div className="flex flex-col items-center roboto-regular pb-[6rem]">
                <Form.Item<Post>
                    label={
                        <h2 className="roboto-bold text-[1rem]">
                            Loại tin đăng
                        </h2>
                    }
                    name="postType"
                    className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]"
                >
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        style={{ width: '100%' }}
                        className="flex items-center"
                    >
                        <Radio.Button
                            value="rent"
                            className="w-[50%] h-[3rem] block text-center roboto-regular"
                            style={{ lineHeight: '3rem' }}
                        >
                            Cho thuê
                        </Radio.Button>
                        <Radio.Button
                            value="sell"
                            style={{ lineHeight: '3rem' }}
                            className="w-[50%] h-[3rem] block text-center roboto-regular "
                        >
                            Bán
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="location"
                    label={<h2 className="roboto-bold text-[1rem]">Địa chỉ</h2>}
                    className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]"
                >
                    <MyAddressInput setLocation={setLocation} />
                </Form.Item>
            </div>
            <div className="fixed bottom-0 left-0 right-0 h-[6rem] px-[1.25rem]">
                <div className="flex items-center justify-between h-full border-t px-[3rem]">
                    <Button
                        color="danger"
                        variant="outlined"
                        size="large"
                        htmlType="button"
                        onClick={() => router.push('/profile/managePost')}
                    >
                        Thoát
                    </Button>
                    <Form.Item className="mb-0">
                        <Button type="primary" size="large" htmlType="submit">
                            Đăng tin
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
}

export default PostPage;
