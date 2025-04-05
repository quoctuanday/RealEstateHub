'use client';
import { createCategory, getCategory } from '@/api/api';
import EditCateModel from '@/components/editCateModel';
import { Category } from '@/schema/Category';
import { useUser } from '@/store/store';
import {
    Button,
    Form,
    FormProps,
    Input,
    Modal,
    Tag,
    Space,
    Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';

type FieldType = {
    name?: string;
    childCate?: string[];
};

function ManagesCatePage() {
    const { socket } = useUser();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selectedcategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [childCategories, setChildCategories] = useState<string[]>([]);
    const [newChildCategory, setNewChildCategory] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
            const response = await getCategory();
            if (response) {
                const data = response.data;
                console.log(data);
                setCategories(data);
            }
        };
        getData();
        if (socket) {
            socket.on('category-update', () => {
                getData();
            });
            return () => {
                socket.off('category-update', () => {
                    getData();
                });
            };
        }
    }, [socket]);

    const handleFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const data = {
            name: values.name,
            childCate: childCategories,
        };
        const response = await createCategory(data);
        if (response) {
            form.resetFields();
            setChildCategories([]);
            setIsLoading(false);
            setIsOpenModal(false);
        }

        console.log(data);
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
        <div>
            <div className="flex items-center justify-end py-3 ">
                <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => setIsOpenModal(true)}
                    className="mr-3"
                >
                    Tạo danh mục
                </Button>
            </div>

            <Modal
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                    validateMessages={{ required: 'Bạn chưa nhập trường này!' }}
                >
                    <h1>Tạo danh mục</h1>
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
                    <Form.Item<FieldType> label="Danh mục con (nếu có)">
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
                            onClick={() => setIsOpenModal(false)}
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
                            Tạo danh mục
                        </Button>
                    </div>
                </Form>
            </Modal>
            <div className="w-full h-[20rem] bg-white">
                <div className="grid grid-cols-7">
                    <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Stt
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Danh mục
                    </div>

                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Trạng thái
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Thao tác
                    </div>
                </div>
                {categories
                    ? categories.map((category, index) => (
                          <div className="grid grid-cols-7" key={category._id}>
                              <div className="col-span-1 flex justify-center items-center py-1 roboto-regular border-[1px]">
                                  {index + 1}
                              </div>
                              <div className="col-span-2 flex justify-center items-center py-1 roboto-regular border-[1px]">
                                  {category.name}
                              </div>

                              <div className="col-span-2 flex justify-center items-center py-1 roboto-regular border-[1px]">
                                  {category.isActive
                                      ? 'Đang hiển thị'
                                      : 'Chưa hiển thị'}
                              </div>
                              <div className="col-span-2 flex justify-center items-center py-1 roboto-regular border-[1px]">
                                  <Button
                                      onClick={() => {
                                          setIsEditModal(true);
                                          setSelectedCategory(category);
                                      }}
                                      variant="outlined"
                                      color="blue"
                                      icon={<CiEdit />}
                                  ></Button>
                                  <Switch
                                      className="ml-3"
                                      checked={category.isActive}
                                  ></Switch>
                              </div>
                          </div>
                      ))
                    : ''}
                <EditCateModel
                    category={selectedcategory}
                    setIsEditModal={setIsEditModal}
                    isEditModal={isEditModal}
                />
            </div>
        </div>
    );
}

export default ManagesCatePage;
