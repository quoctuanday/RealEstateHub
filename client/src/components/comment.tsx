// components/CommentForm.tsx
'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Rate, message, Spin } from 'antd';
import {
    createComment,
    deleteComment,
    blockComment,
    getComment,
} from '@/api/api';
import { Comments } from '@/schema/Comment';
import Image from 'next/image';
import { FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
import { MdOutlineBlock } from 'react-icons/md';
import dateConvert from '@/utils/convertDate';
import Link from 'next/link';
import { useUser } from '@/store/store';

interface Props {
    postId: string;
}

const CommentForm = ({ postId }: Props) => {
    const [form] = Form.useForm();
    const { userLoginData } = useUser();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [comments, setComments] = useState<Comments[]>([]);
    const [userComment, setUserComment] = useState<Comments | null>(null);
    const [page, setPage] = useState(1);
    const listRef = useRef<HTMLDivElement | null>(null);

    const fetchComments = useCallback(
        async (append = false) => {
            if (!postId) return;
            try {
                const res = await getComment(postId);
                const allComments = res.data.comment.filter(
                    (c: Comments) => !c.isBlocked
                );

                if (userLoginData) {
                    const myComment = allComments.find(
                        (c: Comments) => c.userId === userLoginData._id
                    );
                    setUserComment(myComment || null);
                }

                const paginated = allComments.slice(0, page * 5);
                setComments(
                    append
                        ? [...comments, ...paginated.slice(comments.length)]
                        : paginated
                );
            } catch (err) {
                console.log('Không thể tải bình luận');
            }
        },
        [postId, userLoginData, page]
    );

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
        await fetchComments(true);
        setLoadingMore(false);
    };

    const handleDelete = async (id: string) => {
        const res = await deleteComment(id);
        if (res) {
            message.success('Xoá bình luận thành công');
            setPage(1);
            fetchComments();
        }
    };

    const handleBlock = async (id: string) => {
        const res = await blockComment(id);
        if (res) {
            message.success('Đã chặn bình luận');
            setPage(1);
            fetchComments();
        }
    };

    const onFinish = async (values: { content: string; rate: number }) => {
        try {
            setLoading(true);
            const response = await createComment({
                data: { ...values, postId },
                type: true,
            });
            if (response) {
                message.success('Bình luận thành công!');
                form.resetFields();
                setPage(1);
                fetchComments();
            }
        } catch {
            message.error('Gửi bình luận thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3">
            <h1 className="roboto-bold">Bình luận và đánh giá</h1>

            {userComment ? (
                <div className="mt-1">
                    <h1 className="roboto-bold">Bình luận của bạn</h1>
                    <div className="flex mt-3 w-full">
                        <Image
                            src={
                                userComment.image || '/images/avatar-trang.jpg'
                            }
                            alt=""
                            width={100}
                            height={100}
                            className="rounded-full w-[3rem] h-[3rem]"
                        />
                        <div className="flex flex-col ml-2 w-full">
                            <div className="flex items-center">
                                <p className="roboto-bold">
                                    {userComment.userName}
                                </p>
                                {userComment.isBlocked && (
                                    <div className="ml-2 text-red-400 text-[0.8rem]">
                                        Đã bị khóa
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) =>
                                    i < (userComment?.rate || 0) ? (
                                        <FaStar
                                            key={i}
                                            className="text-yellow-500 text-[1rem] mr-1"
                                        />
                                    ) : (
                                        <FaRegStar
                                            key={i}
                                            className="text-gray-400 text-[1rem] mr-1"
                                        />
                                    )
                                )}
                            </div>
                            <p className="mt-2 whitespace-pre-line">
                                {userComment.content}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="roboto-thin">
                                    {dateConvert(userComment.createdAt)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(userComment._id)
                                    }
                                    className="text-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : userLoginData ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="bg-gray-50 p-4 rounded shadow mt-4"
                >
                    <Form.Item
                        label="Bình luận"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nội dung bình luận',
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={5}
                            placeholder="Nhập bình luận..."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Đánh giá"
                        name="rate"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng đánh giá sao',
                            },
                        ]}
                    >
                        <Rate allowClear allowHalf />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Gửi bình luận
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <div className="mt-2">
                    Bạn chưa đăng nhập. Mời bạn{' '}
                    <Link href="/login" className="text-blue-400 underline">
                        đăng nhập tại đây
                    </Link>{' '}
                    hoặc{' '}
                    <Link href="/register" className="text-blue-400 underline">
                        đăng ký tại đây
                    </Link>
                    .
                </div>
            )}

            <h1 className="roboto-bold mt-3">Các bình luận </h1>
            {comments.length > 0 ? (
                <div ref={listRef}>
                    {comments.map((cmt) => (
                        <div className="flex mt-3" key={cmt._id}>
                            <Image
                                src={cmt.image || '/images/avatar-trang.jpg'}
                                alt=""
                                width={100}
                                height={100}
                                className="rounded-full w-[3rem] h-[3rem]"
                            />
                            <div className="flex flex-col ml-2">
                                <p className="roboto-bold">{cmt.userName}</p>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) =>
                                        i < (cmt?.rate || 0) ? (
                                            <FaStar
                                                key={i}
                                                className="text-yellow-500 text-[1rem] mr-1"
                                            />
                                        ) : (
                                            <FaRegStar
                                                key={i}
                                                className="text-gray-400 text-[1rem] mr-1"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="mt-2 whitespace-pre-line">
                                    {cmt.content}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="roboto-thin">
                                        {dateConvert(cmt.createdAt)}
                                    </span>
                                    {(userLoginData?.role === 'admin' ||
                                        userLoginData?.role ===
                                            'moderator') && (
                                        <button
                                            type="button"
                                            onClick={() => handleBlock(cmt._id)}
                                            className="hover:text-red-500"
                                        >
                                            <MdOutlineBlock />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center mt-4">
                        <Button onClick={handleLoadMore} disabled={loadingMore}>
                            {loadingMore ? <Spin /> : 'Tải thêm bình luận'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-red-500 w-full">
                    Chưa có bình luận nào!
                </div>
            )}
        </div>
    );
};

export default CommentForm;
