import React from 'react';
import DOMPurify from 'dompurify';
import { News } from '@/schema/News';

interface NewsModalProps {
    news: News | null;
}

const dateConvert = (date: string) => {
    const newDate = new Date(date);
    return (
        newDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) +
        ' ' +
        newDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    );
};

const NewsView: React.FC<NewsModalProps> = ({ news }) => {
    if (!news) return <div>Đang tải...</div>;

    const sanitizedContent = DOMPurify.sanitize(news.content);

    return (
        <div className="p-[1.3rem] roboto-regular">
            <h1 className="text-[1.5rem] roboto-bold ">{news.title}</h1>
            <div className="text-sm text-rootColor mb-4">
                Ngày đăng: {news.createdAt ? dateConvert(news.createdAt) : ''}
            </div>

            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </div>
    );
};

export default NewsView;
