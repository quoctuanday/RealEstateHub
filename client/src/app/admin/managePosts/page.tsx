'use client';
import { getPost } from '@/api/api';
import FilterPost from '@/components/filterPost';
import PaginationComponent from '@/components/pagination';
import PopupModal from '@/components/popupModal';
import { Post } from '@/schema/Post';
import dateConvert from '@/utils/convertDate';
import { Button, Input } from 'antd';
import React, { useMemo, useState } from 'react';

function ManagePostsPage() {
    const { Search } = Input;
    const [isFilter, setIsFilter] = useState(false);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const extraQuery = useMemo(() => ({ manageAdmin: true }), []);
    const [popupModal, setPopupModal] = useState(false);

    const handleSearch = async (value: string) => {
        console.log(value);
        const response = await getPost({ search: value });
        if (response) {
            const data = response.data;
            setPosts(data);
        }
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
                {isFilter && <FilterPost className="" setPosts={setPosts} />}
            </div>
            <div className="w-full min-h-[30rem] bg-white">
                <div className="grid grid-cols-12">
                    <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Stt
                    </div>
                    <div className="col-span-3 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Tiêu đề
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Người đăng
                    </div>
                    <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Ngày đăng
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Trạng thái
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Thanh toán
                    </div>
                    <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
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
                {posts && posts.length > 0 ? (
                    <div className="">
                        {posts.map((post, index) => (
                            <div
                                className="grid grid-cols-12  h-[3.75rem]"
                                key={post._id}
                            >
                                <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {index +
                                        1 +
                                        ((currentPage || 1) - 1) *
                                            (pageSize || 5)}
                                </div>
                                <div className="col-span-3  flex  items-center py-1 roboto-bold border-[1px]">
                                    <span className="truncate">
                                        {' '}
                                        {post.title}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {post.userName}
                                </div>
                                <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {post.createdAt
                                        ? dateConvert(post.createdAt)
                                        : ''}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {post.status === 'pending' && 'Chờ duyệt'}
                                    {post.status === 'active' &&
                                        'Đang hoạt động'}
                                    {post.status === 'decline' && 'Bị từ chối'}
                                    {post.status === 'archived' &&
                                        'Được lưu trữ'}
                                    {post.status === 'deleted' && 'Đã xóa'}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {post.isCheckout
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </div>
                                <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
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
                    <div className=""></div>
                )}
                <div className="mt-5 flex items-center justify-center">
                    <PaginationComponent
                        setPosts={setPosts}
                        setCurrentPages={setCurrentPage}
                        setPageSizes={setPageSize}
                        extraQuery={extraQuery}
                    ></PaginationComponent>
                </div>
            </div>
        </div>
    );
}

export default ManagePostsPage;
