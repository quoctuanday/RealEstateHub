'use client';
import { useState } from 'react';
import { Document } from '@/schema/Documents';
import { getDocuments } from '@/api/api';
import { Button, Input, message } from 'antd';
import { FaEye } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';
import FilePreviewModal from '@/components/FileReviewModal';
import DocumentsPaginationComponent from '@/components/documentPagination';
import dateConvert from '@/utils/convertDate';

const { Search } = Input;

function LegalDocumentsPage() {
    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [filePreviewVisible, setFilePreviewVisible] = useState(false);
    const [fileUrlToPreview, setFileUrlToPreview] = useState<string | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    console.log(currentPage, pageSize);

    const handleSearch = async (value: string) => {
        try {
            const res = await getDocuments({ search: value });
            setDocuments(res.data.data);
        } catch (err) {
            message.error('Không tìm thấy tài liệu phù hợp');
        }
    };

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
                {documents?.map((doc) => (
                    <div
                        key={doc._id}
                        className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200 bg-white"
                    >
                        <h2 className="text-lg font-bold mb-1">{doc.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">
                            Nguồn: {doc.source}
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                            Ngày tạo: {dateConvert(doc.createdAt)}
                        </p>

                        <div className="flex gap-3">
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
                                    const link = document.createElement('a');
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
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <DocumentsPaginationComponent
                    setDocuments={setDocuments}
                    setCurrentPages={setCurrentPage}
                    setPageSizes={setPageSize}
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
