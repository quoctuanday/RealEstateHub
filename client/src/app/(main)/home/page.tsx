import { serverGetPost, serverGetAllNews } from '@/api/serverApi';
import BannerSearch from '@/components/searchBanner';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import dateConvert from '@/utils/convertDate';
import { Post } from '@/schema/Post';
import { News } from '@/schema/News';
import HandleAccessToken from '@/app/(main)/home/handleAccessToken';

export default async function HomePage() {
    const [sellRes, rentRes, newsRes] = await Promise.all([
        serverGetPost({
            status: 'active',
            isCheckout: true,
            postType: 'sell',
            limit: 6,
        }),
        serverGetPost({
            status: 'active',
            isCheckout: true,
            postType: 'rent',
            limit: 6,
        }),
        serverGetAllNews({ limit: 3 }),
    ]);

    const sellPosts: Post[] = sellRes?.data || [];
    const rentPosts: Post[] = rentRes?.data || [];
    const news: News[] = newsRes?.data?.data || [];

    const renderPostList = (posts: Post[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <Link
                    href={`/${post.postType}/${post._id}`}
                    key={post._id}
                    className="border rounded-lg shadow hover:shadow-md transition p-3 block"
                >
                    <Image
                        src={post.images?.[0] || '/images/no-image.png'}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-[200px] object-cover rounded"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <h3 className="mt-3 font-semibold text-base line-clamp-1">
                        {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                        {post.location?.name}
                    </p>
                    <p className="text-sm text-orange-500 font-bold mt-1">
                        {post.price.toLocaleString()} VNĐ
                    </p>
                </Link>
            ))}
        </div>
    );

    return (
        <>
            <HandleAccessToken />
            <div
                className="h-[250px] md:h-[400px] bg-cover bg-center bg-no-repeat relative mb-8"
                style={{ backgroundImage: "url('/images/banner.webp')" }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <Suspense fallback={<div>Đang tải tìm kiếm...</div>}>
                        <BannerSearch />
                    </Suspense>
                </div>
            </div>

            <div className="px-4 md:px-20">
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">
                        Tin đăng nổi bật
                    </h2>

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-medium text-blue-600">
                            Mua bán
                        </h3>
                        <Link
                            href="/sell"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Xem thêm
                        </Link>
                    </div>
                    {renderPostList(sellPosts)}

                    <div className="flex justify-between items-center mt-8 mb-3">
                        <h3 className="text-xl font-medium text-green-600">
                            Cho thuê
                        </h3>
                        <Link
                            href="/rent"
                            className="text-sm text-green-600 hover:underline"
                        >
                            Xem thêm
                        </Link>
                    </div>
                    {renderPostList(rentPosts)}
                </section>

                <section className="mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">
                        Tin tức mới nhất
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {news.map((item) => (
                            <Link
                                href={`/news/${item._id}`}
                                key={item._id}
                                className="border rounded-lg p-4 hover:shadow-md transition flex flex-col justify-between h-full"
                            >
                                <div>
                                    <Image
                                        src={
                                            item.image || '/images/no-image.png'
                                        }
                                        alt={item.title}
                                        width={300}
                                        height={200}
                                        className="w-full h-[200px] object-cover rounded"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <h3 className="mt-3 font-medium text-base line-clamp-2 min-h-[3rem]">
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                    <p>
                                        Người đăng:{' '}
                                        <span className="font-medium">
                                            {item.userName || 'Ẩn danh'}
                                        </span>
                                    </p>
                                    <p>
                                        Ngày đăng {dateConvert(item.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="text-center my-10">
                    <h3 className="text-lg font-semibold mb-2">
                        Bạn đang có phòng cần đăng?
                    </h3>
                    <Link href="/post">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Đăng tin ngay
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}
