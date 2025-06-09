'use client';
import { getAllNews } from '@/api/api';
import PaginationNewsComponent from '@/components/paginationNews';
import { News } from '@/schema/News';
import dateConvert from '@/utils/convertDate';
import { Spin } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function NewsPage() {
    const [news, setNews] = useState<News[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState({
        page: 1,
        limit: 6,
        search: '',
    });
    const [total, setTotal] = useState(0);
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
        <div className="px-[15rem]">
            <h1 className="roboto-bold text-[1.3rem] pt-3">Tin tức</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-3 gap-x-6 gap-y-12">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[10rem] col-span-full">
                        <Spin />
                    </div>
                ) : news && news.length > 0 ? (
                    news.map((item) => (
                        <Link
                            href={`/news/${item._id}`}
                            className="shadow-custom-light rounded overflow-hidden flex flex-col h-[22rem] bg-white"
                            key={item._id}
                        >
                            <div className="h-1/2">
                                <Image
                                    src={item.image}
                                    alt="ảnh tin tức"
                                    width={500}
                                    height={200}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3 flex flex-col justify-between h-1/2">
                                <p className="text-sm text-gray-500">Tin tức</p>
                                <h2 className="text-base font-semibold line-clamp-2">
                                    {item.title}
                                </h2>
                                <p className="text-xs text-gray-400 mt-auto">
                                    Ngày đăng: {dateConvert(item.createdAt)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="h-[5rem] flex items-center justify-center col-span-full">
                        Không có dữ liệu
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center mt-5">
                <PaginationNewsComponent
                    total={total}
                    current={query.page}
                    pageSize={query.limit}
                    setQuery={setQuery}
                />
            </div>
        </div>
    );
}

export default NewsPage;
