'use client';
import { Empty, Modal } from 'antd';
import { Post } from '@/schema/Post';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ModalFavoriteProps {
    open: boolean;
    onClose: () => void;
    favorites: Post[];
}

export default function ModalFavorite({
    open,
    onClose,
    favorites,
}: ModalFavoriteProps) {
    const router = useRouter();

    return (
        <Modal
            title="Bài đăng yêu thích"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {favorites.length === 0 ? (
                <div className="py-8 flex justify-center items-center">
                    <Empty description="Chưa có bài đăng yêu thích nào" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {favorites.map((post) => (
                        <div
                            key={post._id}
                            onClick={() =>
                                router.push(
                                    `/${
                                        post.postType === 'sell'
                                            ? 'sell'
                                            : 'rent'
                                    }/${post._id}`
                                )
                            }
                            className="border rounded p-3 hover:shadow cursor-pointer flex"
                        >
                            <Image
                                src={post.images?.[0] || '/images/no-image.png'}
                                alt={post.title}
                                width={100}
                                height={100}
                                className="rounded w-[100px] h-[80px] object-cover mr-3"
                            />
                            <div>
                                <h4 className="font-medium line-clamp-1">
                                    {post.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {post.location?.name}
                                </p>
                                <p className="text-sm font-bold text-orange-500 mt-1">
                                    {post.price?.toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}
