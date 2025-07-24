'use client';
import { getPost, updatePost } from '@/api/api';
import CommentForm from '@/components/comment';
import ImagesCarosel from '@/components/imagesCarosel';
import MapView from '@/components/map';
import { Post } from '@/schema/Post';
import { useUser } from '@/store/store';
import dateConvert from '@/utils/convertDate';
import { Button } from 'antd';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FaPhone } from 'react-icons/fa';
import { IoIosPricetags } from 'react-icons/io';

function PostRentDetailPage({ id }: { id: string }) {
    const [post, setPost] = useState<Post | null>(null);
    const { socket, userLoginData } = useUser();
    const hasUpdatedView = useRef(false);

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

    useEffect(() => {
        const getPostDetail = async () => {
            try {
                const response = await getPost({ postId: id });

                if (response) {
                    const data = response.data[0];
                    console.log(data);
                    console.log(data);
                    setPost(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getPostDetail();

        if (socket) {
            socket.on('post-update', () => {
                getPostDetail();
            });
            return () => {
                socket.off('post-update', () => {
                    getPostDetail();
                });
            };
        }
    }, [id, socket]);
    useEffect(() => {
        if (userLoginData && !hasUpdatedView.current) {
            hasUpdatedView.current = true;
            updatePost({ isView: true }, id);
        }
    }, [id, userLoginData, hasUpdatedView]);

    return (
        <div className="grid grid-cols-7 px-[10rem] text-[1rem]  ">
            <div className="p-[1rem] col-span-5">
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
                    <div className="mt-2 ">
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
                                {post?.createdAt
                                    ? dateConvert(post?.createdAt)
                                    : ''}
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

                <CommentForm postId={post?._id || ''} />

                <div className="w-full h-[5rem]"></div>
            </div>
            <div className="col-span-2 ">
                <div className="w-full border rounded mt-[1rem]">
                    <div className="flex items-center  p-3 border-b">
                        <Image
                            src={
                                post?.userImage
                                    ? post.userImage
                                    : '/images/avatar-trang.jpg'
                            }
                            alt="Avatar"
                            width={100}
                            height={100}
                            className="rounded-full w-[3rem] h-[3rem]"
                        />
                        <span className="ml-3">{post?.userName}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                        <Button variant="solid" color="blue" icon={<FaPhone />}>
                            {post?.phoneNumber}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostRentDetailPage;
