// components/PaginationComponent.tsx
import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { Post } from '@/schema/Post';
import { getPost } from '@/api/api';

interface PaginationComponentProps {
    setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>;
    person: boolean;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
    setPosts,
    person,
}) => {
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchPosts = async (page: number, limit: number) => {
            try {
                const query = {
                    page,
                    limit,
                    person: person,
                };
                const response = await getPost(query);
                if (response) {
                    const data = response.data;
                    setPosts(data.posts);
                    setTotalPosts(data.total);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(currentPage, pageSize);
    }, [currentPage, pageSize, setPosts, setTotalPosts, person]);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
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
