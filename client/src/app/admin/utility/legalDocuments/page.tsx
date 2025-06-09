'use client';
import { deleteDocument, getDocuments } from '@/api/api';
import DocumentsPaginationComponent from '@/components/documentPagination';
import FilePreviewModal from '@/components/FileReviewModal';
import LegalModal from '@/components/legalModal';
import { Document } from '@/schema/Documents';
import dateConvert from '@/utils/convertDate';
import { useUser } from '@/store/store';
import { Button, Input, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import { FaEye, FaTrash } from 'react-icons/fa';
import FilterByDate from '@/components/filterByDate';

function LegalDocumentPage() {
    const { Search } = Input;
    const { socket } = useUser();

    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [filePreviewVisible, setFilePreviewVisible] = useState(false);
    const [fileUrlToPreview, setFileUrlToPreview] = useState<string | null>(
        null
    );
    const [isModal, setIsModal] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        search: '',
    });

    const handleSearch = (value: string) => {
        setQuery((prev) => ({
            ...prev,
            search: value,
            page: 1,
        }));
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            try {
                const res = await getDocuments(query);
                if (res) {
                    setDocuments(res.data.data);
                    setTotal(res.data.total);
                }
            } catch (error) {
                console.error('Lỗi khi tải tài liệu:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();

        if (!socket) return;
        const handleUpdate = () => {
            fetchDocuments();
        };
        socket.on('documents-update', handleUpdate);

        return () => {
            socket.off('documents-update', handleUpdate);
        };
    }, [query, socket]);

    return (
        <>
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
                        onClick={() => setIsModal(true)}
                    >
                        Thêm tài liệu
                    </Button>
                </div>
                {isFilter && <FilterByDate setQuery={setQuery} />}
                <LegalModal isModal={isModal} setIsModal={setIsModal} />
            </div>

            <div className="bg-white">
                <div className="grid grid-cols-9 border roboto-bold">
                    <div className="col-span-1 border-r flex items-center justify-center">
                        STT
                    </div>
                    <div className="col-span-2 border-r flex items-center justify-center">
                        Tên văn bản
                    </div>
                    <div className="col-span-2 border-r flex items-center justify-center">
                        Nguồn trích dẫn
                    </div>
                    <div className="col-span-2 border-r flex items-center justify-center">
                        Ngày tạo
                    </div>
                    <div className="col-span-2 border-r flex items-center justify-center">
                        Thao tác
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-[10rem]">
                        <Spin />
                    </div>
                ) : documents && documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <div className="grid grid-cols-9 border" key={doc._id}>
                            <div className="col-span-1 border-r flex items-center justify-center">
                                {index + 1 + (query.page - 1) * query.limit}
                            </div>
                            <div className="col-span-2 text-center border-r flex items-center justify-center">
                                <div className="line-clamp-1">{doc.title}</div>
                            </div>
                            <div className="col-span-2 border-r flex items-center justify-center">
                                {doc.source}
                            </div>
                            <div className="col-span-2 border-r flex items-center justify-center">
                                {dateConvert(doc.createdAt)}
                            </div>
                            <div className="col-span-2 border-r py-2 flex items-center justify-center">
                                <Button
                                    onClick={() => {
                                        setFileUrlToPreview(doc.fileUrl);
                                        setFilePreviewVisible(true);
                                    }}
                                    icon={<FaEye />}
                                />
                                <Button
                                    onClick={() => {
                                        const link =
                                            document.createElement('a');
                                        link.href = doc.fileUrl;
                                        link.download = '';
                                        link.target = '_blank';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    icon={<BsDownload />}
                                    className="ml-2"
                                />
                                <Button
                                    variant="outlined"
                                    color="danger"
                                    onClick={async () => {
                                        try {
                                            await deleteDocument(doc._id);
                                            message.success(
                                                'Xoá tài liệu thành công!'
                                            );
                                        } catch (error) {
                                            message.error(
                                                'Đã xảy ra lỗi khi xoá tài liệu!'
                                            );
                                        }
                                    }}
                                    icon={<FaTrash />}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        Chưa có tài liệu nào.
                    </div>
                )}

                <div className="mt-5 flex items-center justify-center">
                    <DocumentsPaginationComponent
                        total={total}
                        current={query.page}
                        pageSize={query.limit}
                        setQuery={setQuery}
                    />
                </div>

                <FilePreviewModal
                    visible={filePreviewVisible}
                    onClose={() => setFilePreviewVisible(false)}
                    fileUrl={fileUrlToPreview}
                />
            </div>
        </>
    );
}

export default LegalDocumentPage;
