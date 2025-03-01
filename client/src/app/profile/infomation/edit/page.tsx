'use client';
import { updateUser } from '@/api/api';
import { useUser } from '@/store/store';
import { Button, DatePicker, Form, FormProps, Input, Radio } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { useRouter } from 'next/navigation';

type FieldType = {
    userName: string;
    image?: string;
    email: string;
    gender?: string;
    phoneNumber?: string;
    DOB?: Date;
};

function EditProfilePage() {
    const router = useRouter();
    const { userLoginData } = useUser();
    const [form] = Form.useForm();
    const [changeImage, setChangeImage] = useState<string | null | undefined>(
        null
    );
    const [file, setFile] = useState<File | null>(null);
    const [visibleFormImage, setVisileFormImage] = useState(false);
    const inputUploadImage = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userLoginData) {
            setChangeImage(userLoginData.image);
            form.setFieldsValue({
                userName: userLoginData?.userName,
                email: userLoginData?.email,
                gender: userLoginData?.gender,
                phoneNumber: userLoginData?.phoneNumber,
                DOB: userLoginData?.DOB ? dayjs(userLoginData.DOB) : null,
            });
        }
    }, [userLoginData, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file) {
            if (file.size > maxSizeInBytes) {
                toast.error('Kích thước ảnh lớn hơn 2Mb. Mời chọn lại!');
                return;
            }
            setFile(file);
            setChangeImage(URL.createObjectURL(file));
        }
    };

    const handleSelectImage = () => {
        if (inputUploadImage.current) {
            inputUploadImage.current.click();
        }
    };
    const handleUploadImage = async () => {
        if (!file) {
            toast.error('Chưa chọn ảnh kìa!');
            return;
        }

        const storageRef = ref(
            storage,
            `realEstateHub/${userLoginData?.userName}/avatar`
        );

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            form.setFieldsValue({ image: url });

            setChangeImage(url);

            toast.success('Tải ảnh lên thành công!');
        } catch (error) {
            console.error('Lỗi upload hình ảnh: ', error);
            toast.error('Tải ảnh lên thất bại, thử lại sau.');
        }
    };

    const handleSubmitEdit: FormProps<FieldType>['onFinish'] = (values) => {
        const formattedValues = {
            ...values,
            DOB: values.DOB ? dayjs(values.DOB).toDate() : null,
        };
        console.log(formattedValues);
        const sendData = async () => {
            const response = await updateUser(formattedValues);
            if (response) {
                toast.success('Chỉnh sửa thông tin thành công!');
                router.push('/profile/infomation');
            }
        };
        sendData();
    };

    return (
        <Form layout="vertical" onFinish={handleSubmitEdit} form={form}>
            <h1 className="roboto-bold text-[1.25rem]">Chỉnh sửa thông tin</h1>
            <div className="flex items-center justify-center mt-[1.25rem] ">
                <div className="relative flex flex-col items-center">
                    <div className="relative">
                        <Form.Item<FieldType> name="image" hidden>
                            <Input />
                        </Form.Item>

                        <Image
                            src={
                                changeImage
                                    ? changeImage
                                    : '/images/avatar-trang.jpg'
                            }
                            alt="avatar"
                            width={200}
                            height={200}
                            className="w-[8rem] h-[8rem] rounded-full "
                            onClick={() =>
                                setVisileFormImage(!visibleFormImage)
                            }
                        ></Image>
                        <div className="absolute bottom-3  right-3 text-white p-1 rounded bg-[#4d4a4a]">
                            <FaCamera />
                        </div>
                    </div>
                    {visibleFormImage ? (
                        <>
                            <div className="min-w-[10rem] min-h-[4rem] p-[1.3rem] mt-2 bg-white rounded border-2 flex flex-col items-center justify-center">
                                <input
                                    ref={inputUploadImage}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <div className="mt-3 flex items-center">
                                    <Button
                                        onClick={handleSelectImage}
                                        type="primary"
                                        htmlType="button"
                                        className="roboto-regular"
                                    >
                                        Chọn ảnh
                                    </Button>
                                    <Button
                                        onClick={handleUploadImage}
                                        type="primary"
                                        htmlType="button"
                                        className="roboto-regular ml-3 "
                                    >
                                        Tải ảnh lên
                                    </Button>
                                </div>
                                <p className="mt-2 roboto-light-italic ">
                                    Kích thước ảnh không vượt quá 2Mb
                                </p>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <Form.Item<FieldType>
                label={<span className="roboto-bold">Tên người dùng</span>}
                name="userName"
                className="mt-[1.25rem]"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label={<span className="roboto-bold">Ngày sinh</span>}
                name="DOB"
                className="mt-[1.25rem]"
                rules={[{ required: true }]}
            >
                <DatePicker value={userLoginData?.DOB}></DatePicker>
            </Form.Item>
            <Form.Item<FieldType>
                label={<span className="roboto-bold">Giới tính</span>}
                name="gender"
                className="mt-[1.25rem]"
                rules={[{ required: true }]}
            >
                <Radio.Group>
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ ">Nữ</Radio>
                </Radio.Group>
            </Form.Item>

            <h1 className="roboto-bold text-[1.25rem] mt-[1.25rem]">
                Thông tin liên hệ
            </h1>
            <div className="mt-2">
                <Form.Item<FieldType>
                    label={<span className="roboto-bold">Email</span>}
                    name="email"
                    className="mt-[1.25rem]"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label={<span className="roboto-bold">Số điện thoại</span>}
                    name="phoneNumber"
                    className="mt-[1.25rem]"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
            </div>
            <Button type="primary" htmlType="submit" className="mt-[1.25rem]">
                Xác nhận
            </Button>
        </Form>
    );
}

export default EditProfilePage;
