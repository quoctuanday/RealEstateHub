'use client';
import { forceDeletedNews, getAllNews } from '@/api/api';
import NewsModal from '@/components/newsModal';
import NewsView from '@/components/newsView';
import PaginationNewsComponent from '@/components/paginationNews';
import { News } from '@/schema/News';
import dateConvert from '@/utils/convertDate';
import { Button, Input, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

function ManageNewsPage() {
    const { Search } = Input;
    const [isFilter, setIsFilter] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [news, setNews] = useState<News[] | null>(null);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [popupModal, setPopupModal] = useState(false);

    const handleSearch = async (value: string) => {
        console.log(value);
        const response = await getAllNews({ search: value });
        if (response) {
            const data = response.data;
            setNews(data.data);
        }
    };

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
                <NewsModal isCreate={isCreate} setIsCreate={setIsCreate} />
                <NewsModal
                    isCreate={isEdit}
                    setIsCreate={setIsEdit}
                    news={selectedNews}
                    isEdit={true}
                />

                {isFilter && <div className=""></div>}
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
                {news && news.length > 0 ? (
                    <div className="">
                        {news.map((news, index) => (
                            <div
                                className="grid grid-cols-9  h-[3.75rem]"
                                key={news._id}
                            >
                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    {index +
                                        1 +
                                        ((currentPage || 1) - 1) *
                                            (pageSize || 5)}
                                </div>
                                <div className="col-span-3  flex  items-center py-1 border-[1px]">
                                    <span className="truncate">
                                        {' '}
                                        {news.title}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {news.userName}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 border-[1px]">
                                    {news.createdAt
                                        ? dateConvert(news.createdAt)
                                        : ''}
                                </div>

                                <div className="col-span-1 flex justify-center items-center py-1 border-[1px]">
                                    <Button
                                        onClick={() => {
                                            setPopupModal(true);
                                            setSelectedNews(news);
                                        }}
                                        variant="outlined"
                                        color="blue"
                                        icon={<FaEye />}
                                    ></Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedNews(news);
                                            setIsEdit(true);
                                        }}
                                        variant="outlined"
                                        color="cyan"
                                        icon={<MdEdit />}
                                        className="ml-2"
                                    ></Button>
                                    <Button
                                        onClick={async () => {
                                            await forceDeletedNews(news._id);
                                        }}
                                        variant="outlined"
                                        color="danger"
                                        icon={<FaTrash />}
                                        className="ml-2"
                                    ></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[3.75rem] w-full flex items-center justify-center ">
                        <Spin />
                    </div>
                )}
                <div className="mt-5 flex items-center justify-center">
                    <PaginationNewsComponent
                        setNews={setNews}
                        setCurrentPages={setCurrentPage}
                        setPageSizes={setPageSize}
                    ></PaginationNewsComponent>
                </div>
            </div>
        </div>
    );
}

export default ManageNewsPage;
