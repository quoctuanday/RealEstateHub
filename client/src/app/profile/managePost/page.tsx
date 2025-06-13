'use client';
import { getPost, updatePost } from '@/api/api';
import { Post } from '@/schema/Post';
import { Button, Input, Popconfirm, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dateConvert from '@/utils/convertDate';
import Image from 'next/image';
import { FaImages } from 'react-icons/fa';
import { IoEye } from 'react-icons/io5';
import { RiEdit2Fill, RiStoreFill } from 'react-icons/ri';
import { MdOutlinePayment } from 'react-icons/md';
import FilterPost from '@/components/filterPost';
import PopupModal from '@/components/popupModal';
import PaginationComponent from '@/components/pagination';
import toast from 'react-hot-toast';
import { useUser } from '@/store/store';

function ManagePostpage() {
    const router = useRouter();
    const { socket } = useUser();
    const { Search } = Input;
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [chosenPost, setChosenPost] = useState<Post | null>(null);
    const [popupModal, setPopupModal] = useState(false);
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        person: true,
    });
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await getPost(query);
                if (res) {
                    setPosts(res.data.posts);
                    setTotal(res.data.total);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
        if (!socket) return;

        const handlePostUpdate = () => {
            fetchPosts();
        };

        socket.on('post-update', handlePostUpdate);

        return () => {
            socket.off('post-update', handlePostUpdate);
        };
    }, [query, socket]);

    const handleSearch = (value: string) => {
        setQuery((prev) => ({
            ...prev,
            search: value,
            page: 1,
        }));
    };

    const handleCheckout = async (postId: string) => {
        console.log(postId);
        const data = { isCheckout: true };
        const response = await updatePost(data, postId);
        if (response) {
            toast.success('Thanh toán thành công!');
        }
    };
    const handleUpdate = async (postId: string) => {
        console.log(postId);
        const data = { status: 'archived' };
        const response = await updatePost(data, postId);
        if (response) {
            toast.success('Đã lưu trữ bài đăng!');
        }
    };

    return (
        <div className="h-full px-[8rem] roboto-regular">
            <div className="flex items-center justify-between mt-[1.25rem]">
                <h1 className="roboto-bold ">Danh sách tin đăng</h1>
                <Button
                    type="primary"
                    className="ml-3"
                    htmlType="button"
                    onClick={() => router.push('/post')}
                >
                    Đăng tin
                </Button>
            </div>
            {popupModal && (
                <PopupModal
                    post={chosenPost}
                    setForm={setPopupModal}
                    isAdmin={false}
                />
            )}
            <Search className="mt-2" onSearch={handleSearch} />
            <FilterPost className="" setQuery={setQuery} />
            <div className="mt-[1.25rem] w-full min-h-[20rem]">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[20rem]">
                        <Spin />
                    </div>
                ) : posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            className="grid grid-cols-11 gap-2 mb-3"
                            key={post._id}
                        >
                            <div className="relative parent col-span-2">
                                <Image
                                    src={post.images[0]}
                                    width={100}
                                    height={100}
                                    alt={`Ảnh 1`}
                                    className="w-full border border-white rounded h-full object-cover"
                                />

                                <div className="hidden children absolute top-0 left-0 right-0 bottom-0 bg-hoverColor opacity-50">
                                    <div className="flex w-full h-full justify-end items-end">
                                        <div className="flex items-center pb-3 pr-3">
                                            <i className="text-black">
                                                <FaImages />
                                            </i>{' '}
                                            {post.images.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6 grid grid-rows-4 ">
                                <div className="row-span-1 line-clamp-2 roboto-bold">
                                    {post.title}
                                </div>

                                <div className="row-span-1 items-center">
                                    <strong>Địa chỉ:</strong>{' '}
                                    {post.location?.name}
                                </div>
                                <div className="row-span-1">
                                    <strong> Giá:</strong>{' '}
                                    {post.price.toLocaleString('vi-VN')} VND
                                </div>
                                <div className="flex items-center">
                                    <span className="row-span-1">
                                        <strong>Loại tin đăng:</strong>{' '}
                                        {post.postType === 'sell'
                                            ? 'Bán'
                                            : 'Cho thuê'}
                                    </span>
                                    <span className="ml-3">
                                        <strong>Trạng thái:</strong>{' '}
                                        {post.status === 'pending' &&
                                            'Chờ xử lí'}
                                        {post.status === 'active' &&
                                            'Đang hoạt động'}{' '}
                                        {post.status === 'decline' &&
                                            'Bị từ chối'}
                                        {post.status === 'archived' &&
                                            'Đang lưu trữ'}
                                        {post.status === 'expired' &&
                                            'Đã hết hạn'}
                                        {post.status === 'deleted' && 'Đã xóa'}
                                    </span>
                                </div>
                                <div className="row-span-1 flex items-center">
                                    <div className="">
                                        <strong>Ngày đăng:</strong>
                                        {dateConvert(post.createdAt)}
                                    </div>
                                    <span className="ml-2">
                                        Lượt xem: {post.view}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-3  text-center">
                                <div className="">
                                    <strong>Thao tác</strong>
                                    <div className="flex items-center justify-center mt-[2rem]">
                                        <Button
                                            icon={<IoEye />}
                                            variant="filled"
                                            className="block"
                                            htmlType="button"
                                            onClick={() => {
                                                setChosenPost(post);
                                                setPopupModal(true);
                                            }}
                                        ></Button>

                                        <Button
                                            icon={<RiEdit2Fill />}
                                            variant="filled"
                                            className="block relative parent ml-4"
                                            htmlType="button"
                                            onClick={() => {
                                                router.push(
                                                    `/post/edit/${post._id}`
                                                );
                                            }}
                                        ></Button>

                                        <Popconfirm
                                            placement="top"
                                            title="Lưu trữ bài đăng"
                                            description="Bài đăng được lưu trữ sẽ không còn xuất hiện trên bảng tin."
                                            okText="Có"
                                            cancelText="Không"
                                            disabled={
                                                post.status === 'active'
                                                    ? false
                                                    : true
                                            }
                                            onConfirm={async () =>
                                                handleUpdate(post._id)
                                            }
                                        >
                                            <Button
                                                icon={<RiStoreFill />}
                                                variant="filled"
                                                disabled={
                                                    post.status === 'active'
                                                        ? false
                                                        : true
                                                }
                                                className="block relative parent ml-4"
                                            ></Button>
                                        </Popconfirm>

                                        <Popconfirm
                                            placement="top"
                                            title="Thanh toán cho bài đăng"
                                            description={`Bạn có đồng ý thanh toán cho bài đăng với giá ${(
                                                post.duration * 1000
                                            ).toLocaleString('vi-VN')} đồng?`}
                                            okText="Có"
                                            cancelText="Không"
                                            disabled={post.isCheckout}
                                            onConfirm={() =>
                                                handleCheckout(post._id)
                                            }
                                        >
                                            <Button
                                                icon={<MdOutlinePayment />}
                                                variant="filled"
                                                disabled={post.isCheckout}
                                                className="block relative parent ml-4"
                                            ></Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <span>Bạn chưa đăng tin nào!</span>
                )}
            </div>
            <div className="flex w-full justify-center items-center py-5">
                <PaginationComponent
                    total={total}
                    current={query.page}
                    pageSize={query.limit}
                    setQuery={setQuery}
                />
            </div>
        </div>
    );
}

export default ManagePostpage;
