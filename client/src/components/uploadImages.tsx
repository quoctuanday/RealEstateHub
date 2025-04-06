/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { UploadFile } from 'antd/es/upload/interface';
import { storage } from '@/firebase/config';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    setImages: React.Dispatch<React.SetStateAction<Images | null>>;
    userLoginData: any;
}

interface Images {
    images: string[];
    urlSaveImages: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    setImages,
    userLoginData,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const files = fileList
        .map((file) => file.originFileObj)
        .filter(
            (file): file is NonNullable<typeof file> =>
                file !== undefined && file !== null
        );

    async function handleUploadImages() {
        if (files.length < 4) {
            toast.error('Vui lòng chọn ít nhất 4 ảnh!');
            return;
        }
        setIsLoading(true);
        const randomFolderName = uuidv4();
        const folderPath = `realEstateHub/${userLoginData?.userName}/post/${randomFolderName}`;

        try {
            const uploadImages = await Promise.all(
                files.map(async (file) => {
                    const storageRef = ref(
                        storage,
                        `${folderPath}/${file.name}`
                    );
                    try {
                        await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(storageRef);
                        return url;
                    } catch (error) {
                        console.error('Lỗi upload ảnh:', error);
                        return null;
                    }
                })
            );

            const successfulUploads = uploadImages.filter(
                (url) => url !== null
            );

            setImages({ images: successfulUploads, urlSaveImages: folderPath });
            setIsLoading(false);

            toast.success('Tải ảnh lên thành công!');
            console.log('Folder path:', folderPath);
            console.log('Uploaded image URLs:', successfulUploads);
        } catch (error) {
            console.error('Lỗi khi upload hình ảnh:', error);
            toast.error('Tải ảnh lên thất bại, thử lại sau.');
        }
    }

    return (
        <div className="mt-[1.25rem] mb-0 w-[60%] rounded-[15px] border p-[1rem]">
            <h1 className="roboto-bold text-[1rem]">Hình ảnh</h1>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                multiple
                accept="image/*"
            >
                {fileList.length >= 8 ? null : (
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>
            <Button
                loading={isLoading}
                type="primary"
                className="mt-2"
                htmlType="button"
                onClick={handleUploadImages}
            >
                Tải ảnh lên
            </Button>
        </div>
    );
};

export default ImageUpload;
