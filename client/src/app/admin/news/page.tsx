'use client';
import { forceDeletedNews, getAllNews } from '@/api/api';
import NewsModal from '@/components/newsModal';
import NewsView from '@/components/newsView';
import PaginationNewsComponent from '@/components/paginationNews';
import { News } from '@/schema/News';
import dateConvert from '@/utils/convertDate';
import { Button, Input, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import FilterByDate from '@/components/filterByDate';

function ManageNewsPage() {
    const { Search } = Input;
    const [isFilter, setIsFilter] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [news, setNews] = useState<News[] | null>(null);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [popupModal, setPopupModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        search: '',
    });
    const [total, setTotal] = useState(0);

    const handleSearch = (value: string) => {
        setQuery((prev) => ({
            ...prev,
            search: value,
            page: 1,
        }));
    };

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const res = await getAllNews(query);
                if (res) {
                    setNews(res.data.data);
                    setTotal(res.data.total || 0);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [query]);

    return (
        <div className="">
            <div className="p-[1rem]">
                <Search className="" onSearch={handleSearch} />
                <div className="flex items-center mt-[1rem]">
                    <Button
                        className=""
                        type="primary"
                        onClick={() => setIsFilter(!isFilter)}
                    >
                        Bộ lọc
                    </Button>
                    <Button
                        className="ml-2"
                        type="primary"
                        onClick={() => setIsCreate(true)}
                    >
                        Thêm tin tức
                    </Button>
                </div>
                {isFilter && <FilterByDate className="" setQuery={setQuery} />}
                <NewsModal isCreate={isCreate} setIsCreate={setIsCreate} />
                <NewsModal
                    isCreate={isEdit}
                    setIsCreate={setIsEdit}
                    news={selectedNews}
                    isEdit={true}
                />
            </div>

            <div className="w-full min-h-[30rem] bg-white">
                <div className="grid grid-cols-9 roboto-bold">
                    <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                        Stt
                    </div>
                    <div className="col-span-3 flex justify-center items-center py-1 border-[1px]">
                        Tiêu đề
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                        Người đăng
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                        Ngày đăng
                    </div>
                    <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                        Thao tác
                    </div>
                </div>

                <Modal
                    width={800}
                    open={popupModal}
                    onCancel={() => setPopupModal(false)}
                    footer={null}
                >
                    <NewsView news={selectedNews} />
                </Modal>

                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[10rem]">
                        <Spin />
                    </div>
                ) : news && news.length > 0 ? (
                    <div className="">
                        {news.map((n, index) => (
                            <div
                                className="grid grid-cols-9  h-[3.75rem]"
                                key={n._id}
                            >
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    {index + 1 + (query.page - 1) * query.limit}
                                </div>
                                <div className="col-span-3 flex items-center py-1 border-[1px]">
                                    <span className="truncate">{n.title}</span>
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {n.userName}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {n.createdAt
                                        ? dateConvert(n.createdAt)
                                        : ''}
                                </div>
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    <Button
                                        onClick={() => {
                                            setPopupModal(true);
                                            setSelectedNews(n);
                                        }}
                                        icon={<FaEye />}
                                    />
                                    <Button
                                        onClick={() => {
                                            setSelectedNews(n);
                                            setIsEdit(true);
                                        }}
                                        icon={<MdEdit />}
                                        className="ml-2"
                                    />
                                    <Button
                                        onClick={async () => {
                                            await forceDeletedNews(n._id);
                                        }}
                                        icon={<FaTrash />}
                                        className="ml-2"
                                        variant="outlined"
                                        color="danger"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[5rem] flex items-center justify-center">
                        Không có dữ liệu
                    </div>
                )}
                <div className="mt-5 flex items-center justify-center">
                    <PaginationNewsComponent
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

export default ManageNewsPage;
