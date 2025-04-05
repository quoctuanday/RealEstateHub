'use client';
import { updateCategory } from '@/api/api';
import { Category } from '@/schema/Category';
import { Button, Form, FormProps, Input, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
interface Props {
    setIsEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditModal: boolean;
    category: Category | null;
}

type FieldType = {
    name?: string;
    childCate?: string[];
};

function EditCateModel({ isEditModal, setIsEditModal, category }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [childCategories, setChildCategories] = useState<string[]>([]);
    const [newChildCategory, setNewChildCategory] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (category) {
            form.setFieldValue('name', category.name);
            setChildCategories(category.childCate);
        }
    }, [category, form]);

    const handleFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const response = await updateCategory(category?._id, {
            name: values.name,
            childCate: childCategories,
        });
        if (response) {
            form.resetFields();
            setChildCategories([]);
            setIsLoading(false);
            setIsEditModal(false);
        }
    };

    const handleAddChildCategory = () => {
        if (newChildCategory && !childCategories.includes(newChildCategory)) {
            setChildCategories([...childCategories, newChildCategory]);
            setNewChildCategory('');
        }
    };

    const handleRemoveChildCategory = (category: string) => {
        setChildCategories(childCategories.filter((item) => item !== category));
    };
    return (
        <Modal
            open={isEditModal}
            onCancel={() => setIsEditModal(false)}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                validateMessages={{
                    required: 'Bạn chưa nhập trường này!',
                }}
            >
                <h1>Chỉnh sửa danh mục</h1>
                <Form.Item<FieldType>
                    required
                    rules={[
                        { required: true },
                        {
                            message: 'Chưa nhập tên danh mục!',
                        },
                    ]}
                    label="Nhập tên danh mục"
                    name="name"
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Danh mục con ">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Input
                            value={newChildCategory}
                            onChange={(e) =>
                                setNewChildCategory(e.target.value)
                            }
                            onPressEnter={handleAddChildCategory}
                            placeholder="Nhập tên danh mục con"
                        />
                        <Button
                            variant="solid"
                            onClick={handleAddChildCategory}
                        >
                            Thêm
                        </Button>
                        <div>
                            {childCategories.map((category) => (
                                <Tag
                                    color="cyan"
                                    key={category}
                                    closable
                                    className="mt-1"
                                    onClose={() =>
                                        handleRemoveChildCategory(category)
                                    }
                                >
                                    {category}
                                </Tag>
                            ))}
                        </div>
                    </Space>
                </Form.Item>
                <div className="flex items-center justify-end ">
                    <Button
                        key="back"
                        htmlType="button"
                        color="danger"
                        onClick={() => setIsEditModal(false)}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        key="submit"
                        htmlType="submit"
                        className="ml-3"
                        type="primary"
                        loading={isLoading}
                    >
                        Chỉnh sửa danh mục
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default EditCateModel;
