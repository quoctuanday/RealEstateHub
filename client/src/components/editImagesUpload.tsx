/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { UploadFile } from 'antd/es/upload/interface';
import { storage } from '@/firebase/config';
import toast from 'react-hot-toast';

export interface Images {
    images: string[];
    urlSaveImages: string;
}

interface ImageUploadProps {
    setImages: React.Dispatch<React.SetStateAction<Images | null>>;
    userLoginData: any;
    // Giá trị ban đầu chứa các ảnh đã upload (nếu có)
    value?: Images | null;
}

const EditImageUpload: React.FC<ImageUploadProps> = ({
    setImages,
    userLoginData,
    value,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // Khi nhận được giá trị ban đầu (từ API) qua prop value, chuyển đổi mảng URL thành fileList
    useEffect(() => {
        if (value && value.images) {
            const initialFileList = value.images.map((url, index) => ({
                uid: `uploaded-${index}`,
                name: `Image ${index + 1}`,
                status: 'done' as const,
                url,
            }));
            setFileList(initialFileList);
        }
    }, [value]);

    const handleChange = (info: { fileList: UploadFile[] }) => {
        setFileList(info.fileList);
    };

    async function handleUploadImages() {
        const newFiles = fileList
            .filter((file) => !file.url)
            .map((file) => file.originFileObj)
            .filter(
                (file): file is NonNullable<typeof file> =>
                    file !== undefined && file !== null
            );

        const alreadyUploadedCount = fileList.filter((file) => file.url).length;
        if (alreadyUploadedCount + newFiles.length < 4) {
            toast.error('Vui lòng chọn ít nhất 4 ảnh!');
            return;
        }

        const folderPath =
            value && value.urlSaveImages
                ? value.urlSaveImages
                : `realEstateHub/${userLoginData?.userName}/post/${uuidv4()}`;

        try {
            // Upload chỉ các file mới chưa có url
            const uploadResults = await Promise.all(
                newFiles.map(async (file) => {
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

            // Lọc ra các URL upload thành công
            const successfulUploads = uploadResults.filter(
                (url): url is string => url !== null
            );

            const existingURLs = fileList
                .filter((file) => file.url)
                .map((file) => file.url as string);

            const allURLs = [...existingURLs, ...successfulUploads];

            const updatedFileList = fileList.map((file) => {
                if (!file.url && file.originFileObj) {
                    return {
                        ...file,
                        url: successfulUploads.shift() || undefined,
                        status: 'done' as const,
                    };
                }
                return file;
            });
            setFileList(updatedFileList);

            setImages({ images: allURLs, urlSaveImages: folderPath });
            toast.success('Tải ảnh lên thành công!');
            console.log('Folder path:', folderPath);
            console.log('Uploaded image URLs:', allURLs);
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
                onChange={handleChange}
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

export default EditImageUpload;
