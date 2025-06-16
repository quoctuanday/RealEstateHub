import { Post } from '@/schema/Post';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import formatTimeDifference from '@/utils/format-time';
import dateConvert from '@/utils/convertDate';
import formatMoneyShort from '@/utils/formatMoney';

export default function PostList({ posts }: { posts: Post[] }) {
    if (!posts || posts.length === 0) {
        return (
            <div className="flex items-center justify-center text-red-400">
                Chưa có tin đăng nào!
            </div>
        );
    }

    return (
        <ul className="mt-[1.25rem]">
            {posts.map((post, index) => (
                <div
                    className={`grid grid-rows-3 overflow-hidden border rounded ${
                        index === 0 ? '' : 'mt-[1.25rem]'
                    }`}
                    key={post._id}
                >
                    <div className="row-span-2 grid grid-cols-3 gap-1 relative">
                        <Image
                            src={post.images?.[0] || '/images/no-image.png'}
                            alt={post.title}
                            width={300}
                            height={300}
                            className="w-full h-full col-span-2"
                        />
                        <div className="col-span-1 grid grid-rows-2 gap-1">
                            <Image
                                src={post.images?.[1] || '/images/no-image.png'}
                                alt={post.title}
                                width={100}
                                height={100}
                                className="w-full h-full row-span-1"
                            />
                            <Image
                                src={post.images?.[2] || '/images/no-image.png'}
                                alt={post.title}
                                width={100}
                                height={100}
                                className="w-full h-full row-span-1"
                            />
                        </div>
                        <div className="absolute flex items-center text-white text-[1rem] bottom-[5%] right-[5%]">
                            <i>
                                <span className="mr-1">Ảnh</span>
                            </i>
                            <span>{post.images?.length || 0}</span>
                        </div>
                    </div>

                    <div className="row-span-1">
                        <Link
                            href={`/sell/${post._id}`}
                            className="p-3 border-b block"
                        >
                            <h2 className="roboto-bold uppercase line-clamp-2">
                                {post.title}
                            </h2>
                            <div className="mt-3 flex items-center text-blue-400">
                                <span>{formatMoneyShort(post.price)}</span>
                                <span className="ml-2">{post.acreage} m²</span>
                                {typeof post.rate === 'number' && (
                                    <span className="flex items-center ml-4 text-yellow-500 text-[0.9rem]">
                                        {[1, 2, 3, 4, 5].map((i) => {
                                            if (i <= Math.floor(post.rate))
                                                return <FaStar key={i} />;
                                            if (i - post.rate <= 0.5)
                                                return (
                                                    <FaStarHalfAlt key={i} />
                                                );
                                            return (
                                                <FaRegStar
                                                    key={i}
                                                    className="text-gray-300"
                                                />
                                            );
                                        })}
                                    </span>
                                )}
                                <div className="flex items-center ml-3">
                                    <MdOutlineRemoveRedEye />
                                    <span className="ml-1">{post.view}</span>
                                </div>
                            </div>
                            <span className="mt-1 line-clamp-1 text-blue-400">
                                {post.location?.name}
                            </span>
                            <div className="mt-1 line-clamp-3">
                                {post.description}
                            </div>
                        </Link>

                        <div className="p-3 flex items-center">
                            <Image
                                src={
                                    post.userImage || '/images/avatar-trang.jpg'
                                }
                                alt="avatar user"
                                width={100}
                                height={100}
                                className="rounded-full w-[2rem] h-[2rem]"
                            />
                            <div className="ml-2 text-[0.75rem]">
                                <span className="block">
                                    {post.userName || 'Ẩn danh'}
                                </span>
                                <span>
                                    Đăng {formatTimeDifference(post.createdAt)}{' '}
                                    (
                                    <span
                                        className="cursor-default"
                                        title={dateConvert(post.createdAt)}
                                    >
                                        {dateConvert(post.createdAt)}
                                    </span>
                                    )
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </ul>
    );
}
