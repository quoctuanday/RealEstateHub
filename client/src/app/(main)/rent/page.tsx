'use client';
import PaginationComponent from '@/components/pagination';
import { Post } from '@/schema/Post';
import { Button, message, Spin, Tooltip } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import formatTimeDifference from '@/utils/format-time';
import maskPhoneNumber from '@/utils/hidePhoneNumber';
import {
    FaHeart,
    FaImage,
    FaPhone,
    FaRegHeart,
    FaRegStar,
    FaStar,
    FaStarHalfAlt,
} from 'react-icons/fa';
import { useUser } from '@/store/store';
import dateConvert from '@/utils/convertDate';
import formatMoneyShort from '@/utils/formatMoney';
import { addFavourite, getCategory, getPost } from '@/api/api';
import { Category } from '@/schema/Category';
import FilterPostPage from '@/components/filterPostPage';
import SearchPostPage from '@/components/searchPostPage';
import Link from 'next/link';

function RentPage() {
    const { userLoginData, socket } = useUser();
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selectedChildCates, setSelectedChildCates] = useState<string[]>([]);
    const [isPhoneHidden, setIsPhoneHidden] = useState(true);
    const [query, setQuery] = useState({
        page: 1,
        limit: 5,
        postType: 'rent',
        status: 'active',
    });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getCate = async () => {
            const response = await getCategory();
            if (response) {
                const data = response.data;
                console.log(data);
                setCategories(data);
            }
        };
        getCate();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await getPost(query);
                if (res) {
                    setPosts(res.data.posts);
                    setTotal(res.data.total);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
        if (!socket) return;

        const handlePostUpdate = () => {
            fetchPosts();
        };

        socket.on('post-update', handlePostUpdate);

        return () => {
            socket.off('post-update', handlePostUpdate);
        };
    }, [query, socket]);

    const toggleChildCate = (childCate: string) => {
        setSelectedChildCates((prev) => {
            const newSelected = prev.includes(childCate)
                ? prev.filter((c) => c !== childCate)
                : [...prev, childCate];

            setQuery((prevQuery) => ({
                ...prevQuery,
                childCate: newSelected,
                page: 1,
            }));

            return newSelected;
        });
    };

    return (
        <div className="mt-[1.25rem] px-[15rem]">
            <SearchPostPage setQuery={setQuery} />
            <div className="py-[1.25rem] flex items-center border-b">
                <FilterPostPage setQuery={setQuery} />
            </div>
            <div className="grid grid-cols-8 mt-[1.25rem] gap-5 min-h-[15rem]">
                <main className="col-span-6 ">
                    <h1 className="roboto-bold text-xl">Cho thuê nhà đất</h1>
                    <span className="mt-[1.25rem]">
                        Hiện có {posts?.length} tin đăng.
                    </span>

                    <ul className="mt-[1.25rem]">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Spin />
                            </div>
                        ) : posts && posts?.length > 0 ? (
                            <>
                                {posts.map((post, index) => (
                                    <div
                                        className={`grid grid-rows-3 overflow-hidden border rounded ${
                                            index == 0 ? '' : 'mt-[1.25rem]'
                                        }`}
                                        key={index}
                                    >
                                        <div className="row-span-2 grid grid-cols-3 gap-1 relative">
                                            <Image
                                                src={
                                                    post.images
                                                        ? post.images[0]
                                                        : ''
                                                }
                                                alt=""
                                                width={300}
                                                height={300}
                                                className="w-full h-full col-span-2"
                                            ></Image>
                                            <div className="col-span-1 grid grid-rows-2 gap-1">
                                                <Image
                                                    src={
                                                        post.images
                                                            ? post.images[1]
                                                            : ''
                                                    }
                                                    alt=""
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-full row-span-1"
                                                ></Image>
                                                <Image
                                                    src={
                                                        post.images
                                                            ? post.images[2]
                                                            : ''
                                                    }
                                                    alt=""
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-full row-span-1"
                                                ></Image>
                                            </div>
                                            <div className="absolute flex items-center text-white text-[1rem] bottom-[5%] right-[5%] ">
                                                <i className="">
                                                    <FaImage />
                                                </i>
                                                <span className="ml-1">
                                                    {post.images.length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row-span-1">
                                            <Link
                                                href={`/rent/${post._id}`}
                                                className="p-3 border-b block"
                                            >
                                                <h2 className="roboto-bold uppercase line-clamp-2 ">
                                                    {post.title}
                                                </h2>
                                                <div className="mt-3 flex items-center  text-blue-400">
                                                    <span className="">
                                                        {' '}
                                                        {formatMoneyShort(
                                                            post.price
                                                        )}
                                                    </span>
                                                    <span className="ml-2">
                                                        {' '}
                                                        {post.acreage} m²
                                                    </span>
                                                    {typeof post.rate ===
                                                        'number' && (
                                                        <span className="flex items-center ml-4 text-yellow-500 text-[0.9rem]">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((i) => {
                                                                if (
                                                                    i <=
                                                                    Math.floor(
                                                                        post.rate
                                                                    )
                                                                )
                                                                    return (
                                                                        <FaStar
                                                                            key={
                                                                                i
                                                                            }
                                                                        />
                                                                    );
                                                                if (
                                                                    i -
                                                                        post.rate <=
                                                                    0.5
                                                                )
                                                                    return (
                                                                        <FaStarHalfAlt
                                                                            key={
                                                                                i
                                                                            }
                                                                        />
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
                                                </div>
                                                <span className="mt-1 line-clamp-1 text-blue-400">
                                                    {post.location?.name}
                                                </span>
                                                <div className="mt-1 line-clamp-3">
                                                    {post.description}
                                                </div>
                                            </Link>
                                            <div className="p-3 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={
                                                            post.userImage
                                                                ? post.userImage
                                                                : ''
                                                        }
                                                        alt="avatar user"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-full w-[2rem] h-[2rem]"
                                                    />
                                                    <div className="ml-2 text-[0.75rem]">
                                                        <span className="block text-center">
                                                            {post.userName}
                                                        </span>
                                                        <Tooltip
                                                            title={dateConvert(
                                                                post.createdAt
                                                            )}
                                                            placement="right"
                                                            className="cursor-default"
                                                        >
                                                            Đăng{' '}
                                                            {formatTimeDifference(
                                                                post.createdAt
                                                            )}
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="solid"
                                                        color="blue"
                                                        icon={<FaPhone />}
                                                        onClick={() => {
                                                            if (userLoginData) {
                                                                setIsPhoneHidden(
                                                                    false
                                                                );
                                                            } else {
                                                                message.warning(
                                                                    'Bạn cần đăng nhập để xem số điện thoại'
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {isPhoneHidden
                                                            ? maskPhoneNumber(
                                                                  post.phoneNumber
                                                              )
                                                            : post.phoneNumber}
                                                    </Button>
                                                    <Button
                                                        onClick={async () => {
                                                            if (
                                                                !userLoginData
                                                            ) {
                                                                return message.warning(
                                                                    'Bạn cần đăng nhập để yêu thích bài viết'
                                                                );
                                                            }
                                                            try {
                                                                const res =
                                                                    await addFavourite(
                                                                        {
                                                                            postId: post._id,
                                                                        }
                                                                    );

                                                                setPosts(
                                                                    (prev) =>
                                                                        prev?.map(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p._id ===
                                                                                post._id
                                                                                    ? {
                                                                                          ...p,
                                                                                          isFavourite:
                                                                                              !p.isFavourite,
                                                                                      }
                                                                                    : p
                                                                        ) ??
                                                                        null
                                                                );

                                                                message.success(
                                                                    res.data
                                                                        .message
                                                                );
                                                            } catch (err) {
                                                                message.error(
                                                                    'Lỗi khi xử lý yêu thích'
                                                                );
                                                            }
                                                        }}
                                                        icon={
                                                            post.isFavourite ? (
                                                                <FaHeart />
                                                            ) : (
                                                                <FaRegHeart />
                                                            )
                                                        }
                                                        variant="outlined"
                                                        color="gold"
                                                        className="ml-3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="flex items-center justify-center text-red-400">
                                Chưa có tin đăng nào!
                            </div>
                        )}
                    </ul>
                    <div className="flex items-center justify-center py-5">
                        <PaginationComponent
                            total={total}
                            current={query.page}
                            pageSize={query.limit}
                            setQuery={setQuery}
                        />
                    </div>
                </main>
                <aside className="col-span-2 rounded border p-5">
                    {categories?.map((category, index) => (
                        <ul key={index} className={index === 0 ? '' : 'mt-3'}>
                            <h1 className="roboto-bold">{category.name}</h1>
                            {category.childCate.map((childCate, index) => {
                                const isSelected =
                                    selectedChildCates.includes(childCate);
                                return (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            toggleChildCate(childCate)
                                        }
                                        className={`py-1 text-[0.75rem] cursor-pointer hover:text-blue-400 ${
                                            isSelected
                                                ? 'text-blue-600 font-semibold'
                                                : ''
                                        }`}
                                    >
                                        {childCate}
                                    </li>
                                );
                            })}
                        </ul>
                    ))}
                </aside>
            </div>
        </div>
    );
}

export default RentPage;
