// components/PaginationComponent.tsx
import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { getDocuments } from '@/api/api';
import { useUser } from '@/store/store';
import { Document } from '@/schema/Documents';

interface PaginationComponentProps {
    setDocuments: React.Dispatch<React.SetStateAction<Document[] | null>>;
    setCurrentPages?: React.Dispatch<React.SetStateAction<number>>;
    setPageSizes?: React.Dispatch<React.SetStateAction<number>>;
}

const DocumentsPaginationComponent: React.FC<PaginationComponentProps> = ({
    setDocuments,
    setCurrentPages,
    setPageSizes,
}) => {
    const { socket } = useUser();

    const [totalDocument, setTotalDocument] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchDocuments = async (page: number, limit: number) => {
            try {
                const query = {
                    page,
                    limit,
                };
                const response = await getDocuments(query);
                if (response) {
                    const data = response.data;
                    setDocuments(data.data);
                    setTotalDocument(data.total);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchDocuments(currentPage, pageSize);
        if (socket) {
            socket.on('documents-update', () => {
                fetchDocuments(currentPage, pageSize);
            });
            return () => {
                socket.off('documents-update', () => {
                    fetchDocuments(currentPage, pageSize);
                });
            };
        }
    }, [currentPage, pageSize, setDocuments, setTotalDocument, socket]);

    const handlePageChange = (page: number, documentSize?: number) => {
        setCurrentPage(page);
        if (setCurrentPages) setCurrentPages(page);
        if (documentSize) {
            setPageSize(documentSize);
            if (setPageSizes) setPageSizes(documentSize);
        }
    };

    return (
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalDocument}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
        />
    );
};

export default DocumentsPaginationComponent;
