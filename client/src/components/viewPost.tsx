'use client';
import { updatePost } from '@/api/api';
import ImagesCarosel from '@/components/imagesCarosel';
import MapView from '@/components/map';
import { Post } from '@/schema/Post';
import dateConvert from '@/utils/convertDate';
import maskPhoneNumber from '@/utils/hidePhoneNumber';
import { Button } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPhoneVolume } from 'react-icons/fa';
import { IoIosPricetags } from 'react-icons/io';

interface Props {
    post: Post | null;
    isAdmin: boolean;
    setForm: React.Dispatch<React.SetStateAction<boolean>>;
}
interface UpdatePostData {
    status: string;
    message: string;
    feedBack?: string;
}

function ViewPost({ post, isAdmin, setForm }: Props) {
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        setFeedback(post?.feedBack || '');
    }, [post]);

    const features = [
        {
            icon: <IoIosPricetags />,
            label: 'Mức giá',
            value:
                post?.price?.toLocaleString('vi-VN') +
                (post?.postType === 'rent' ? ' /tháng' : ''),
            condition: post?.price !== undefined,
        },
        {
            icon: (
                <Image
                    src="/images/icon/plans.png"
                    width={16}
                    height={16}
                    alt="room"
                />
            ),
            label: 'Diện tích',
            value: post?.acreage + ' m²',
            condition: post?.acreage !== undefined,
        },
        {
            icon: (
                <Image
                    src="/images/icon/room.png"
                    width={16}
                    height={16}
                    alt="room"
                />
            ),
            label: 'Số phòng',
            value: post?.features?.room,
            condition: post?.features?.room !== undefined,
        },
        {
            icon: (
                <Image
                    src="/images/icon/public-toilet.png"
                    width={16}
                    height={16}
                    alt="toilet"
                />
            ),
            label: 'Số toilet',
            value: post?.features?.bathroom,
            condition: post?.features?.bathroom !== undefined,
        },
        {
            icon: (
                <Image
                    src="/images/icon/kitchen-set.png"
                    width={16}
                    height={16}
                    alt="floor"
                />
            ),
            label: 'Chỗ nấu ăn',
            value: 'Có',
            condition: post?.features?.convenients.includes('Có chỗ nấu ăn'),
        },
        {
            icon: (
                <Image
                    src="/images/icon/air.png"
                    width={16}
                    height={16}
                    alt="direction"
                />
            ),
            label: 'Bình nóng lạnh',
            value: 'Có',
            condition:
                post?.features?.convenients.includes('Có bình nóng lạnh'),
        },
    ];

    const handleUpdate = async (isApprove: boolean) => {
        const data: UpdatePostData = {
            status: '',
            message: '',
        };
        if (isApprove) {
            data.status = 'active';
            data.message = `Bài viết \"${post?.title}\" đã được duyệt.`;
        } else {
            data.status = 'decline';
            data.message = `Bài viết \"${post?.title}\" đã bị từ chối.`;
            data.feedBack = feedback;
        }
        const response = await updatePost(data, post?._id);
        if (response) {
            toast.success(
                isApprove ? 'Bài viết đã  duyệt' : 'Bài viết đã từ chối'
            );
            setForm(false);
        }
    };

    return (
        <div className="mt-[1.25rem] text-[1rem] relative">
            <div className="p-[1rem]">
                <ImagesCarosel images={post?.images ?? []} />
                <h1 className="roboto-bold mt-[1.25rem] text-2xl">
                    {post?.title}
                </h1>
                <h2 className="mt-4">{post?.location?.name}</h2>
                <div className="mt-4 py-2 border-y flex ">
                    <div className="flex-col">
                        <h3 className="roboto-bold text-gray-400">Mức giá</h3>
                        <span>
                            {post?.price.toLocaleString('vi-VN')}{' '}
                            {post?.postType === 'sell' ? '' : '/tháng'}
                        </span>
                    </div>
                    <div className="flex-col ml-5">
                        <h3 className="roboto-bold text-gray-400">Diện tích</h3>
                        <span>{post?.acreage} m&sup2;</span>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="roboto-bold text-xl">Thông tin mô tả</h2>
                    <p className="mt-2 whitespace-pre-line">
                        {post?.description}
                    </p>
                </div>
                <div className="mt-4">
                    <h2 className="roboto-bold text-xl">
                        Đặc điểm bất động sản
                    </h2>
                    <div className="grid grid-cols-2 gap-2 mt-2 border-y py-2">
                        {features.map(
                            (feature, index) =>
                                feature.condition && (
                                    <div
                                        key={index}
                                        className="col-span-1 grid grid-cols-2 py-2"
                                    >
                                        <div className="col-span-1 flex items-center">
                                            {feature.icon}
                                            <span className="ml-2 roboto-bold">
                                                {feature.label}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            {feature.value}
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="roboto-bold text-xl">Bản đồ</h2>
                    <div className="mt-2">
                        <MapView
                            longitude={
                                post?.location?.coordinates.longitude ||
                                105.83991
                            }
                            latitude={
                                post?.location?.coordinates.latitude || 21.028
                            }
                        />
                    </div>
                </div>
                <div className="mt-4 border-y p-3">
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <label className="text-gray-400"> Ngày đăng</label>
                            <span className="roboto-bold">
                                {dateConvert(post?.createdAt)}
                            </span>
                        </div>
                        <div className="flex flex-col ml-3">
                            <label className="text-gray-400"> Loại tin</label>
                            <span className="roboto-bold">
                                {post?.postType === 'sell'
                                    ? 'Đăng bán'
                                    : 'Cho thuê'}
                            </span>
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <div className="mt-4">
                        <h2 className="roboto-bold text-xl">Phản hồi</h2>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="border rounded w-full min-h-[10rem] mt-2 border-black outline-none px-1"
                        ></textarea>
                    </div>
                )}
                <div className="w-full h-[5rem]"></div>
            </div>
            <div className="sticky bottom-0 h-[5rem] flex items-center justify-center bg-white">
                {isAdmin ? (
                    <div className="flex items-center">
                        <Button
                            variant="solid"
                            color="danger"
                            disabled={!feedback.trim()}
                            onClick={() => handleUpdate(false)}
                        >
                            Từ chối
                        </Button>
                        <Button
                            variant="solid"
                            className="ml-3"
                            color="blue"
                            onClick={() => handleUpdate(true)}
                            disabled={post?.status === 'active'}
                        >
                            Đồng ý
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="solid"
                        color="blue"
                        className="text-[1.25rem] px-5"
                    >
                        <i>
                            <FaPhoneVolume />
                        </i>
                        <span>
                            {maskPhoneNumber(post?.phoneNumber)} Bấm để hiện số
                        </span>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ViewPost;
