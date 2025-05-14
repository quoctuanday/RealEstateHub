'use client';
import { deleteDocument } from '@/api/api';
import DocumentsPaginationComponent from '@/components/documentPagination';
import FilePreviewModal from '@/components/FileReviewModal';
import LegalModal from '@/components/legalModal';
import { Document } from '@/schema/Documents';
import dateConvert from '@/utils/convertDate';
import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import { FaEye, FaTrash } from 'react-icons/fa';

function LegalDocumentPage() {
    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [filePreviewVisible, setFilePreviewVisible] = useState(false);
    const [fileUrlToPreview, setFileUrlToPreview] = useState<string | null>(
        null
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { Search } = Input;
    const [isModal, setIsModal] = useState(false);
    const handleSearch = async () => {};
    return (
        <>
            <div className="p-[1rem]">
                <Search className="" onSearch={handleSearch} />
                <div className="flex items-center mt-[1rem]">
                    <Button className="" type="primary" onClick={() => {}}>
                        Bộ lọc
                    </Button>
                    <Button
                        className="ml-2"
                        type="primary"
                        onClick={() => {
                            setIsModal(true);
                        }}
                    >
                        Thêm tài liệu
                    </Button>
                </div>
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
                {documents?.map((documents, index) => (
                    <div
                        className="grid grid-cols-9 border py-2"
                        key={documents._id}
                    >
                        <div className="col-span-1 border-r flex items-center justify-center">
                            {index +
                                1 +
                                ((currentPage || 1) - 1) * (pageSize || 5)}
                        </div>
                        <div className="col-span-2 border-r flex items-center justify-center">
                            {documents.title}
                        </div>
                        <div className="col-span-2 border-r flex items-center justify-center">
                            {documents.source}
                        </div>
                        <div className="col-span-2 border-r flex items-center justify-center">
                            {dateConvert(documents.createdAt)}
                        </div>
                        <div className="col-span-2 border-r flex items-center justify-center">
                            <Button
                                onClick={() => {
                                    setFileUrlToPreview(documents.fileUrl);
                                    setFilePreviewVisible(true);
                                }}
                                variant="outlined"
                                color="blue"
                                icon={<FaEye />}
                            />

                            <Button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = documents.fileUrl;
                                    link.download = '';
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                variant="outlined"
                                color="cyan"
                                icon={<BsDownload />}
                                className="ml-2"
                            ></Button>
                            <Button
                                onClick={async () => {
                                    try {
                                        await deleteDocument(documents._id);
                                        message.success(
                                            'Xoá tài liệu thành công!'
                                        );
                                    } catch (error) {
                                        message.error(
                                            'Đã xảy ra lỗi khi xoá tài liệu!'
                                        );
                                    }
                                }}
                                variant="outlined"
                                color="danger"
                                icon={<FaTrash />}
                                className="ml-2"
                            ></Button>
                        </div>
                    </div>
                ))}
                <div className="mt-5 flex items-center justify-center">
                    <DocumentsPaginationComponent
                        setDocuments={setDocuments}
                        setCurrentPages={setCurrentPage}
                        setPageSizes={setPageSize}
                    ></DocumentsPaginationComponent>
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
