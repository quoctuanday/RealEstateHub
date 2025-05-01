'use client';
import { useEffect, useState } from 'react';
import { getAllNews } from '@/api/api';
import dateConvert from '@/utils/convertDate';
import React from 'react';
import { News } from '@/schema/News';
import DOMPurify from 'dompurify';

function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [newsDetail, setNewsDetail] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = React.use(params);

    useEffect(() => {
        if (!id) return;

        const getDetailData = async () => {
            try {
                setLoading(true);
                const query = {
                    page: 1,
                    limit: 1,
                    newsId: id,
                };
                const response = await getAllNews(query);
                if (response) {
                    const data = response.data.data[0];
                    setNewsDetail(data);
                }
            } catch (error) {
                console.log(error);
                setError('Lỗi khi tải tin tức.');
            } finally {
                setLoading(false);
            }
        };

        getDetailData();
    }, [id]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!newsDetail) return <div>Không có dữ liệu để hiển thị.</div>;

    const sanitizedContent = DOMPurify.sanitize(newsDetail.content, {
        USE_PROFILES: { html: true },
    });

    return (
        <div className="py-[1.3rem] px-[15rem] roboto-regular">
            <h1 className="text-[1.5rem] roboto-bold mb-4">
                {newsDetail.title}
            </h1>
            <div className="text-sm text-rootColor mb-4">
                Ngày đăng: {dateConvert(newsDetail.createdAt)}
            </div>

            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </div>
    );
}

export default NewsDetailPage;
