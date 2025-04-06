import React, { useEffect, useState } from 'react';
import { Modal, Input, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { createNews, updateNews } from '@/api/api';
import { useUser } from '@/store/store';
import { News } from '@/schema/News';

interface NewsModalProps {
    isCreate: boolean;
    setIsCreate: (value: boolean) => void;
    isEdit?: boolean;
    news?: News | null;
}

const NewsModal: React.FC<NewsModalProps> = ({
    isCreate,
    setIsCreate,
    isEdit = false,
    news = null,
}) => {
    const { userLoginData } = useUser();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (isEdit && news) {
            setTitle(news.title || '');
            setContent(news.content || '');
            setImage(news.image || '');
        } else {
            resetForm();
        }
    }, [isEdit, news, isCreate]);

    const extractFirstImageUrl = (htmlContent: string): string | null => {
        const regex = /<img[^>]+src="([^"]+)"/;
        const match = htmlContent.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            message.error('Vui lòng nhập tiêu đề và nội dung!');
            return;
        }

        const data = {
            title,
            content,
            image,
            userId: userLoginData?._id,
        };

        try {
            if (isEdit && news?._id) {
                const response = await updateNews(news._id, data);
                if (response) {
                    message.success('Cập nhật tin tức thành công!');
                    setIsCreate(false);
                    resetForm();
                } else {
                    message.error('Cập nhật thất bại!');
                }
            } else {
                const response = await createNews(data);
                if (response) {
                    message.success('Thêm tin tức thành công!');
                    setIsCreate(false);
                    resetForm();
                } else {
                    message.error('Thêm thất bại!');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImage('');
    };

    return (
        <Modal
            width={800}
            title={isEdit ? 'Chỉnh sửa tin tức' : 'Thêm tin tức'}
            open={isCreate}
            onCancel={() => setIsCreate(false)}
            onOk={handleSubmit}
            okText={isEdit ? 'Cập nhật' : 'Lưu'}
            cancelText="Hủy"
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
                    <label className="roboto-bold">Nội dung</label>
                    <Editor
                        apiKey="nnplqoe94p83xkbl9cqz5osr7xcapr0b13vfukxyhmmzp9nr"
                        init={{
                            height: 300,
                            menubar: true,
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'charmap',
                                'preview',
                                'anchor',
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        }}
                        value={content}
                        onEditorChange={(newContent: string) => {
                            setContent(newContent);
                            const firstImageUrl =
                                extractFirstImageUrl(newContent);
                            if (firstImageUrl) {
                                setImage(firstImageUrl);
                            }
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default NewsModal;
