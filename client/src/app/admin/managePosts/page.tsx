'use client';
import { getPost } from '@/api/api';
import FilterPost from '@/components/filterPost';
import PaginationComponent from '@/components/pagination';
import PopupModal from '@/components/popupModal';
import { Post } from '@/schema/Post';
import { useUser } from '@/store/store';
import dateConvert from '@/utils/convertDate';
import { Button, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

function ManagePostsPage() {
    const { Search } = Input;
    const { socket } = useUser();
    const [isFilter, setIsFilter] = useState(false);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [popupModal, setPopupModal] = useState(false);
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        manageAdmin: true,
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

    return (
        <div className="">
            <div className="p-[1rem]">
                <Search className="" onSearch={handleSearch} />
                <Button
                    className="mt-[1rem]"
                    type="primary"
                    onClick={() => setIsFilter(!isFilter)}
                >
                    Bộ lọc
                </Button>
                {isFilter && <FilterPost className="" setQuery={setQuery} />}
            </div>
            <div className="w-full min-h-[30rem] bg-white">
                <div className="grid grid-cols-12 roboto-bold">
                    <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                        Stt
                    </div>
                    <div className="col-span-3 flex justify-center items-center py-1 border-[1px]">
                        Tiêu đề
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                        Người đăng
                    </div>
                    <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                        Ngày đăng
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                        Trạng thái
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                        Thanh toán
                    </div>
                    <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                        Thao tác
                    </div>
                </div>
                {popupModal && (
                    <PopupModal
                        post={selectedPost}
                        setForm={setPopupModal}
                        isAdmin={true}
                    />
                )}
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[20rem]">
                        <Spin />
                    </div>
                ) : posts && posts.length > 0 ? (
                    <div className="">
                        {posts.map((post, index) => (
                            <div
                                className="grid grid-cols-12  h-[3.75rem]"
                                key={post._id}
                            >
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    {index +
                                        1 +
                                        ((query.page || 1) - 1) *
                                            (query.limit || 5)}
                                </div>
                                <div className="col-span-3  flex  items-center py-1 border-[1px]">
                                    <span className="truncate">
                                        {' '}
                                        {post.title}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {post.userName}
                                </div>
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    {post.createdAt
                                        ? dateConvert(post.createdAt)
                                        : ''}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {post.status === 'pending' && 'Chờ duyệt'}
                                    {post.status === 'active' &&
                                        'Đang hoạt động'}
                                    {post.status === 'decline' && 'Bị từ chối'}
                                    {post.status === 'archived' &&
                                        'Được lưu trữ'}
                                    {post.status === 'deleted' && 'Đã xóa'}
                                    {post.status === 'expired' && 'Hết hạn'}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {post.isCheckout
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </div>
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    <Button
                                        onClick={() => {
                                            setPopupModal(true);
                                            setSelectedPost(post);
                                        }}
                                        className="px-2 py-1 rounded-[10px] bg-rootColor hover:bg-[#699ba3b8] text-white "
                                    >
                                        Xem
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[5rem] flex items-center justify-center">
                        Chưa có bài đăng nào !
                    </div>
                )}
                <div className="mt-5 flex items-center justify-center">
                    <PaginationComponent
                        total={total}
                        current={query.page}
                        pageSize={query.limit}
                        setQuery={setQuery}
                    />
                </div>
            </div>
        </div>
    );
}

export default ManagePostsPage;
