// components/PaginationComponent.tsx
import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { getAllNews } from '@/api/api';
import { useUser } from '@/store/store';
import { News } from '@/schema/News';

interface PaginationComponentProps {
    setNews: React.Dispatch<React.SetStateAction<News[] | null>>;
    setCurrentPages?: React.Dispatch<React.SetStateAction<number>>;
    setPageSizes?: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationNewsComponent: React.FC<PaginationComponentProps> = ({
    setNews,
    setCurrentPages,
    setPageSizes,
}) => {
    const { socket } = useUser();

    const [totalNews, setTotalNews] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchNews = async (page: number, limit: number) => {
            try {
                const query = {
                    page,
                    limit,
                };
                const response = await getAllNews(query);
                if (response) {
                    const data = response.data;
                    setNews(data.data);
                    setTotalNews(data.total);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchNews(currentPage, pageSize);
        if (socket) {
            socket.on('news-update', () => {
                fetchNews(currentPage, pageSize);
            });
            return () => {
                socket.off('news-update', () => {
                    fetchNews(currentPage, pageSize);
                });
            };
        }
    }, [currentPage, pageSize, setNews, setTotalNews, socket]);

    const handlePageChange = (page: number, newSize?: number) => {
        setCurrentPage(page);
        if (setCurrentPages) setCurrentPages(page);
        if (newSize) {
            setPageSize(newSize);
            if (setPageSizes) setPageSizes(newSize);
        }
    };

    return (
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalNews}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
        />
    );
};

export default PaginationNewsComponent;
