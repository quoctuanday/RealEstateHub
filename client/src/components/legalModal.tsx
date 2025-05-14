import { useState } from 'react';
import { Modal, Input, message, Upload, UploadFile, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '@/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createDocument } from '@/api/api';

interface LegalModalProps {
    isModal: boolean;
    setIsModal: (value: boolean) => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isModal, setIsModal }) => {
    const [title, setTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [sourceName, setSourceName] = useState('');
    const [sourceLink, setSourceLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const beforeUpload = (file: File) => {
        const isAcceptedType =
            file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // .docx

        if (!isAcceptedType) {
            message.error(
                'Chỉ được phép tải lên file PDF hoặc Word (.doc, .docx)!'
            );
        }

        return isAcceptedType ? false : Upload.LIST_IGNORE;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!title || fileList.length === 0) {
            message.error('Vui lòng nhập tiêu đề và tải lên file!');
            return;
        }

        const folderPath = 'realEstateHub/legalDocuments';
        const file = fileList[0].originFileObj as File;
        const fileRef = ref(storage, `${folderPath}/${file.name}`);

        try {
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            const data = {
                title,
                fileUrl: url,
                source: sourceName,
                sourceUrl: sourceLink,
            };

            const response = await createDocument(data);
            if (response) {
                message.success('Lưu thành công!');
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi upload file!');
        } finally {
            // Dọn dẹp
            setIsLoading(false);
            setIsModal(false);
            setTitle('');
            setFileList([]);
            setSourceName('');
            setSourceLink('');
        }
    };

    return (
        <Modal
            width={600}
            title={'Thêm văn bản'}
            open={isModal}
            onCancel={() => setIsModal(false)}
            onOk={handleSubmit}
            okText={'Lưu văn bản'}
            cancelText="Hủy"
            confirmLoading={isLoading}
        >
            <div>
                <div className="mb-4">
                    <label className="roboto-bold">Tiêu đề</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tiêu đề"
                    />
                </div>

                <div className="mb-4">
                    <label className="roboto-bold">Tải file</label>
                    <Upload
                        className="ml-3"
                        beforeUpload={beforeUpload}
                        fileList={fileList}
                        onChange={({ fileList }) => {
                            setFileList(fileList.slice(-1));
                        }}
                        maxCount={1}
                        multiple={false}
                        accept=".pdf,.doc,.docx"
                    >
                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                    </Upload>
                </div>

                <div className="mb-4">
                    <label className="roboto-bold">Tên nguồn</label>
                    <Input
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="Ví dụ: Cổng thông tin Chính phủ"
                    />
                </div>

                <div>
                    <label className="roboto-bold">Link nguồn</label>
                    <Input
                        value={sourceLink}
                        onChange={(e) => setSourceLink(e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            </div>
        </Modal>
    );
};

export default LegalModal;
