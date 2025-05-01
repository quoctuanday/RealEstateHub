'use client';
import PaginationNewsComponent from '@/components/paginationNews';
import { News } from '@/schema/News';
import dateConvert from '@/utils/convertDate';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

function NewsPage() {
    const [news, setNews] = useState<News[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    console.log(currentPage, pageSize);

    return (
        <div className="px-[15rem]">
            <h1 className="roboto-bold text-[1.3rem] pt-3">Tin tức</h1>
            <div className="grid grid-cols-3 mt-3 gap-x-6 gap-y-12">
                {news ? (
                    news.map((news) => (
                        <Link
                            href={`/news/${news._id}`}
                            className="grid shadow-custom-light grid-rows-2 col-span-1 h-[22rem] w-full  rounded"
                            key={news._id}
                        >
                            <div className="row-span-1 rounded-t  overflow-hidden">
                                <Image
                                    src={news.image}
                                    alt="ảnh tin tức"
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    className="w-full h-full"
                                ></Image>
                            </div>
                            <div className="row-span-1 rounded-b bg-white ml-3 ">
                                <p className=" mt-3 roboto-thin">Tin tức</p>
                                <h2 className=" roboto-bold text-[1.3rem] line-clamp-2 ">
                                    {news.title}
                                </h2>
                                <p>Ngày đăng: {dateConvert(news.createdAt)}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="flex items-center justify-center text-black spin">
                        <FaSpinner />
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center mt-5">
                <PaginationNewsComponent
                    setCurrentPages={setCurrentPage}
                    setPageSizes={setPageSize}
                    setNews={setNews}
                />
            </div>
        </div>
    );
}

export default NewsPage;
