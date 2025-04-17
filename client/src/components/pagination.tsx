/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PaginationComponent.tsx
import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { Post } from '@/schema/Post';
import { getPost } from '@/api/api';
import { useUser } from '@/store/store';

interface PaginationComponentProps {
    setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>;
    setCurrentPages?: React.Dispatch<React.SetStateAction<number>>;
    setPageSizes?: React.Dispatch<React.SetStateAction<number>>;
    extraQuery?: Record<string, any>;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
    setPosts,
    setCurrentPages,
    setPageSizes,
    extraQuery = {},
}) => {
    const { socket } = useUser();

    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchPosts = async (page: number, limit: number) => {
            try {
                const query = {
                    page,
                    limit,
                    ...extraQuery,
                };
                const response = await getPost(query);
                if (response) {
                    const data = response.data;
                    setPosts(data.posts);
                    setTotalPosts(data.total);
                    console.log(data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage, pageSize);
        if (socket) {
            socket.on('post-update', () => {
                fetchPosts(currentPage, pageSize);
            });
            return () => {
                socket.off('post-update', () => {
                    fetchPosts(currentPage, pageSize);
                });
            };
        }
    }, [currentPage, pageSize, setPosts, setTotalPosts, socket, extraQuery]);

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
            total={totalPosts}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
        />
    );
};

export default PaginationComponent;
