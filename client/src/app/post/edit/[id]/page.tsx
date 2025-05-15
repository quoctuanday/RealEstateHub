/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import TitleComponent from '@/components/title';
import {
    Button,
    Form,
    FormProps,
    Input,
    InputNumber,
    Radio,
    Select,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Post } from '@/schema/Post';
import MyAddressInput from '@/components/addressInput';
import GoongMap from '@/components/mapBox';
import { useUser } from '@/store/store';
import { FaRobot } from 'react-icons/fa';
import { generateTitle, getPost, updatePost } from '@/api/api';
import ThinkingDots from '@/components/thinkingDot';
import toast from 'react-hot-toast';
import EditImageUpload from '@/components/editImagesUpload';

interface Location {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const houseTypes = [
    { id: 1, name: 'Chung cư' },
    { id: 2, name: 'Condotel' },
    { id: 3, name: 'Biệt thự' },
    { id: 4, name: 'Nhà cấp 4' },
    { id: 5, name: 'Nhà mặt phố' },
    { id: 6, name: 'Kho, xưởng' },
];
const convenients = [
    { id: 1, name: 'Có điều hòa' },
    { id: 2, name: 'Có bình nóng lạnh' },
    { id: 3, name: 'Có chỗ gửi xe' },
    { id: 4, name: 'Có thang máy' },
    { id: 6, name: 'Có máy giặt' },
    { id: 7, name: 'Có chỗ nấu ăn' },
    { id: 8, name: 'Có tủ lạnh' },
    { id: 11, name: 'An ninh 24/7' },
    { id: 15, name: 'Có khu vực phơi đồ' },
];

const durations = [
    { value: 7, label: '7 ngày', price: 7000 },
    { value: 15, label: '15 ngày', price: 15000 },
    { value: 30, label: '30 ngày', price: 30000 },
];

interface Images {
    images: string[];
    urlSaveImages: string;
}

const CustomRadio = ({ value, selected, onChange, price }: any) => {
    return (
        <div
            className={`
            h-20 flex flex-col items-center justify-center border rounded-md cursor-pointer p-2
            ${
                selected
                    ? 'border-blue-500 bg-blue-100 shadow-custom-medium'
                    : 'border-gray-300'
            }
          `}
            onClick={onChange}
        >
            <div className="text-lg font-bold  flex flex-col items-center justify-center">
                <span>{value} ngày </span>
                <span>{price.toLocaleString('vi-VN')} VND</span>
            </div>
        </div>
    );
};

function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const [duration, setDuration] = useState<number | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const { userLoginData } = useUser();
    const router = useRouter();
    const [form] = Form.useForm();
    const [location, setLocation] = useState<Location | null>(null);
    const [images, setImages] = useState<Images | null>(null);
    const [postExpiredAt, setPostExpiredAt] = useState<Date | null>(null);

    useEffect(() => {
        const getData = async () => {
            const resolvedParams = await params;
            const { id } = resolvedParams;
            const response = await getPost({ postId: id });
            if (response) {
                console.log(response.data);
                const data = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;
                console.log(data.postType);
                form.setFieldsValue({
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    userName: data.userName,
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    acreage: data.acreage,
                    postType: data.postType,
                    houseType: data.houseType,
                    features: data.features,
                });
                setPostExpiredAt(new Date(data.expiredAt));
                setImages({
                    images: data.images,
                    urlSaveImages: data.url,
                });
                setLocation({
                    name: data.location.name,
                    coordinates: {
                        latitude: data.location.coordinates.latitude,
                        longitude: data.location.coordinates.longitude,
                    },
                });
            }
        };
        getData();
    }, [params, form]);

    useEffect(() => {
        if (userLoginData) {
        }
    });

    const handleGenerateAI = async () => {
        setIsThinking(true);
        const postData = form.getFieldsValue();
        postData.location = location;

        try {
            const response = await generateTitle(postData);

            if (response.data) {
                const generatedText = response.data;
                console.log(generatedText.title, generatedText.description);
                setIsThinking(false);
                form.setFieldsValue({
                    title: generatedText.title,
                    description: generatedText.description,
                });
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const handleFinish: FormProps<Post>['onFinish'] = async () => {
        const updatedValues = form.getFieldsValue();
        const now = new Date();
        updatedValues.location = location;
        updatedValues.images = images?.images;
        updatedValues.urlSaveImages = images?.urlSaveImages;
        updatedValues.status = 'pending';

        if (duration) {
            updatedValues.duration = duration;
            updatedValues.isCheckout = false;

            if (!postExpiredAt || new Date(postExpiredAt) < now) {
                updatedValues.expiredAt = new Date(
                    now.getTime() + duration * 24 * 60 * 60 * 1000
                );
            } else {
                updatedValues.expiredAt = new Date(
                    postExpiredAt.getTime() + duration * 24 * 60 * 60 * 1000
                );
            }
        }
        const resolvedParams = await params;
        const { id } = resolvedParams;

        try {
            const response = await updatePost(updatedValues, id);
            if (response) {
                toast.success('Chỉnh sửa bài đăng thành công!');
                router.push('/profile/managePost');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            className="p-[1.25rem]"
        >
            <TitleComponent title="Chỉnh sửa tin đăng" />
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
                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <h2 className="roboto-bold text-[1rem]">Địa chỉ</h2>
                    <MyAddressInput
                        setLocation={setLocation}
                        location={location}
                    />
                    {location?.name && (
                        <div className="mt-[1.25rem]">
                            <GoongMap
                                address={location.name}
                                setLocation={setLocation}
                            />
                        </div>
                    )}
                </div>
                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <h2 className="roboto-bold text-[1rem]">Thông tin chính</h2>

                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">
                                Loại nhà
                            </h3>
                        }
                        name="houseType"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại nhà!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn loại nhà"
                            showSearch
                            className="w-full mt-1"
                            optionFilterProp="label"
                            options={houseTypes.map((item) => ({
                                label: item.name,
                                value: item.name,
                            }))}
                            onChange={(value) =>
                                form.setFieldsValue({ houseType: value })
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">
                                Diện tích
                            </h3>
                        }
                        name="acreage"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập diện tích!',
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập diện tích"
                            className="w-full"
                            addonAfter="m²"
                            min={0}
                        ></InputNumber>
                    </Form.Item>
                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">Mức giá</h3>
                        }
                        className="mb-0"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá!',
                            },
                        ]}
                    >
                        <InputNumber<number>
                            placeholder="Nhập giá"
                            className="w-full"
                            addonAfter="VND"
                            min={0}
                            formatter={(value) =>
                                value
                                    ? `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          '.'
                                      )
                                    : ''
                            }
                            parser={(value) =>
                                value
                                    ? Number(value.replace(/\./g, '')) || 0
                                    : 0
                            }
                        />
                    </Form.Item>
                </div>

                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <h1 className="roboto-bold text-[1rem]">Thông tin khác</h1>
                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">
                                Số phòng
                            </h3>
                        }
                        name={['features', 'room']}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">
                                Số nhà vệ sinh
                            </h3>
                        }
                        name={['features', 'bathroom']}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">
                                Tiện nghi
                            </h3>
                        }
                        name={['features', 'convenients']}
                    >
                        <Select
                            placeholder="Chọn tiện nghi"
                            showSearch
                            mode="multiple"
                            className="w-full mt-1"
                            optionFilterProp="label"
                            options={convenients.map((item) => ({
                                label: item.name,
                                value: item.name,
                            }))}
                            onChange={(value) => {
                                const currentFeatures =
                                    form.getFieldValue('features') || {};
                                form.setFieldsValue({
                                    features: {
                                        ...currentFeatures,
                                        convenients: value,
                                    },
                                });
                            }}
                        />
                    </Form.Item>
                </div>

                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <h1 className="roboto-bold text-[1rem]">
                        Thông tin liên hệ
                    </h1>
                    <div className="mt-2">
                        <Form.Item
                            label={
                                <h3 className="roboto-bold text-[1rem]">
                                    Tên liên hệ
                                </h3>
                            }
                            name="userName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên liên hệ!',
                                },
                            ]}
                        >
                            <Input className="mt-1"></Input>
                        </Form.Item>
                        <Form.Item
                            label={
                                <h3 className="roboto-bold text-[1rem]">
                                    Email
                                </h3>
                            }
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                        >
                            <Input className="mt-1"></Input>
                        </Form.Item>
                        <Form.Item
                            label={
                                <h3 className="roboto-bold text-[1rem]">
                                    Số điện thoại
                                </h3>
                            }
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                            ]}
                            className="mb-0"
                        >
                            <Input className="mt-1"></Input>
                        </Form.Item>
                    </div>
                </div>
                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <Button
                        className=""
                        htmlType="button"
                        icon={<FaRobot />}
                        onClick={() => handleGenerateAI()}
                    >
                        {' '}
                        Sử dụng AI để viết {isThinking && <ThinkingDots />}
                    </Button>
                    <Form.Item
                        className="mt-2"
                        label={
                            <h3 className="roboto-bold text-[1rem]">Tiêu đề</h3>
                        }
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tiêu đề!',
                            },
                        ]}
                    >
                        <Input.TextArea
                            className="w-full"
                            autoSize={{ minRows: 2, maxRows: 5 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <h3 className="roboto-bold text-[1rem]">Mô tả</h3>
                        }
                        name="description"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mô tả!' },
                        ]}
                    >
                        <Input.TextArea
                            className="w-full"
                            autoSize={{ minRows: 5, maxRows: 10 }}
                        />
                    </Form.Item>
                </div>
                <EditImageUpload
                    value={images}
                    userLoginData={userLoginData}
                    setImages={setImages}
                />
                <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
                    <Form.Item
                        label={
                            <div className="flex items-center">
                                <h3 className="roboto-bold text-[1rem]">
                                    Số ngày hiển thị
                                </h3>
                                {postExpiredAt && (
                                    <span className="text-sm text-gray-500 ml-2">
                                        (Còn lại:{' '}
                                        {Math.max(
                                            Math.ceil(
                                                (new Date(
                                                    postExpiredAt
                                                ).getTime() -
                                                    Date.now()) /
                                                    (1000 * 60 * 60 * 24)
                                            ),
                                            0
                                        )}{' '}
                                        ngày)
                                    </span>
                                )}
                            </div>
                        }
                        name="duration"
                    >
                        <Radio.Group
                            onChange={(e) => setDuration(e.target.value)}
                            value={duration}
                            className="grid grid-cols-3 gap-3"
                        >
                            {durations.map((item) => (
                                <CustomRadio
                                    key={item.value}
                                    value={item.value}
                                    price={item.price}
                                    selected={duration === item.value}
                                    onChange={() => {
                                        form.setFieldsValue({
                                            duration: item.value,
                                        });
                                        setDuration(item.value);
                                    }}
                                    onClick={() => console.log('Click')}
                                    className="col-span-1"
                                />
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 h-[6rem] px-[1.25rem] bg-white">
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
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
}

export default EditPostPage;
