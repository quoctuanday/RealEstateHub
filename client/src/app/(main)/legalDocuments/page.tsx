'use client';
import { useEffect, useState } from 'react';
import { Document } from '@/schema/Documents';
import { getDocuments } from '@/api/api';
import { Button, Input, Spin } from 'antd';
import { FaEye } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';
import FilePreviewModal from '@/components/FileReviewModal';
import DocumentsPaginationComponent from '@/components/documentPagination';
import dateConvert from '@/utils/convertDate';
import Link from 'next/link';

const { Search } = Input;

function LegalDocumentsPage() {
    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [filePreviewVisible, setFilePreviewVisible] = useState(false);
    const [fileUrlToPreview, setFileUrlToPreview] = useState<string | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [query, setQuery] = useState({
        page: 1,
        limit: 6,
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
    }, [query]);

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Tài liệu pháp lý</h1>

            <Search
                placeholder="Tìm kiếm tài liệu..."
                allowClear
                enterButton="Tìm"
                size="large"
                onSearch={handleSearch}
                className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="flex justify-center items-center w-full h-[10rem]">
                        <Spin />
                    </div>
                ) : documents && documents.length > 0 ? (
                    documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200 bg-white flex flex-col justify-between min-h-[14rem]"
                        >
                            <h2 className="text-lg font-bold mb-1 line-clamp-2">
                                {doc.title}
                            </h2>
                            <div className="my-auto">
                                <Link
                                    href={doc.sourceUrl}
                                    className="text-sm text-gray-600 mb-2"
                                >
                                    Nguồn: {doc.source}
                                </Link>
                                <p className="text-xs text-gray-400 mb-4">
                                    Ngày tạo: {dateConvert(doc.createdAt)}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <Button
                                    icon={<FaEye />}
                                    onClick={() => {
                                        setFileUrlToPreview(doc.fileUrl);
                                        setFilePreviewVisible(true);
                                    }}
                                >
                                    Xem
                                </Button>
                                <Button
                                    icon={<BsDownload />}
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
                                >
                                    Tải về
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        Chưa có tài liệu nào.
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center">
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
    );
}

export default LegalDocumentsPage;
