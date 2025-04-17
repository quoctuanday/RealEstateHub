'use client';
import PaginationComponent from '@/components/pagination';
import { Post } from '@/schema/Post';
import { Button, Dropdown, Input, Menu, message, Spin, Tooltip } from 'antd';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import formatTimeDifference from '@/utils/format-time';
import maskPhoneNumber from '@/utils/hidePhoneNumber';
import { FaImage, FaPhone, FaRegHeart } from 'react-icons/fa';
import { useUser } from '@/store/store';
import dateConvert from '@/utils/convertDate';
import formatMoneyShort from '@/utils/formatMoney';
import { getCategory } from '@/api/api';
import { Category } from '@/schema/Category';

function SellPage() {
    const { Search } = Input;
    const { userLoginData } = useUser();
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [isPhoneHidden, setIsPhoneHidden] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const extraQuery = useMemo(
        () => ({ status: 'active', postType: 'sell' }),
        []
    );

    const houseTypes = Array.from(new Set(posts.map((post) => post.houseType)));

    const menu = (
        <Menu onClick={({ key }) => onFilter(key)}>
            {houseTypes.map((type) => (
                <Menu.Item key={type}>{type}</Menu.Item>
            ))}
        </Menu>
    );

    const handleSearch = async (value: string) => {
        console.log(value);
    };

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

    return (
        <div className="mt-[1.25rem] px-[15rem]">
            <Search className="" onSearch={handleSearch} />
            <div className="py-[1.25rem] flex items-center border-b">
                <span>Lọc theo</span>
                <Dropdown trigger={['click']}></Dropdown>
            </div>
            <div className="grid grid-cols-8 mt-[1.25rem] gap-5 min-h-[15rem]">
                <main className="col-span-6 ">
                    <h1 className="roboto-bold text-xl">Mua bán nhà đất</h1>
                    <span className="mt-[1.25rem]">
                        Hiện có {posts?.length} tin đăng.
                    </span>

                    <ul className="mt-[1.25rem]">
                        {posts && posts?.length > 0 ? (
                            <>
                                {posts.map((post, index) => (
                                    <li
                                        className={`grid grid-rows-2 overflow-hidden border rounded ${
                                            index == 0 ? '' : 'mt-[1.25rem]'
                                        }`}
                                        key={index}
                                    >
                                        <div className="row-span-1 grid grid-cols-3 gap-1 relative">
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
                                            <div className="p-3 border-b">
                                                <h2 className="roboto-bold uppercase line-clamp-2 ">
                                                    {post.title}
                                                </h2>
                                                <div className="mt-3 text-blue-400">
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
                                                </div>
                                                <span className="mt-1 line-clamp-1 text-blue-400">
                                                    {post.location?.name}
                                                </span>
                                                <div className="mt-1 line-clamp-3">
                                                    {post.description}
                                                </div>
                                            </div>
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
                                                        icon={<FaRegHeart />}
                                                        variant="outlined"
                                                        color="gold"
                                                        className="ml-3"
                                                    ></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </>
                        ) : (
                            <div className="flex items-center justify-center">
                                <Spin />
                            </div>
                        )}
                    </ul>
                    <div className="flex items-center justify-center py-5">
                        <PaginationComponent
                            setPosts={setPosts}
                            setCurrentPages={setCurrentPage}
                            setPageSizes={setPageSize}
                            extraQuery={extraQuery}
                        />
                    </div>
                </main>
                <aside className="col-span-2 rounded border p-5">
                    {categories?.map((category, index) => (
                        <ul key={index} className={index === 0 ? '' : 'mt-3'}>
                            <h1 className="roboto-bold">{category.name}</h1>
                            {category.childCate.map((childCate, index) => (
                                <li
                                    key={index}
                                    className="py-1 text-[0.75rem] cursor-pointer hover:text-blue-400"
                                >
                                    {childCate}
                                </li>
                            ))}
                        </ul>
                    ))}
                </aside>
            </div>
        </div>
    );
}

export default SellPage;
