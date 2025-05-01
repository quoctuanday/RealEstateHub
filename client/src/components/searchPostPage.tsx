/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getDistrict, getPost, getProvince } from '@/api/api';
import { Post } from '@/schema/Post';
import { Select, Popover, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type District = {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    province_code: number;
    wards: string[];
};

type Province = {
    code: number;
    codename: string;
    districts: District[];
    division_type: string;
    name: string;
    phone_code: number;
};

interface Props {
    type: string;
    currentPage?: number;
    pageSize?: number;
    setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchPostPage: React.FC<Props> = ({
    setPosts,
    type,
    currentPage,
    pageSize,
    setIsLoading,
}) => {
    const searchRef = useRef<HTMLDivElement>(null);

    const [provinceData, setProvinceData] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(
        null
    );
    const [districtData, setDistrictData] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<
        string | undefined
    >();
    const [showPopover, setShowPopover] = useState(false);

    const fetchDistricts = async (provinceCode: number) => {
        try {
            const districtResponse = await getDistrict(provinceCode);
            if (districtResponse) {
                console.log(districtResponse.data.districts);
                setDistrictData(districtResponse.data.districts);
            }
        } catch (error) {
            console.error('Failed to fetch districts:', error);
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getProvince();
                if (response) {
                    setProvinceData(response.data);
                    const defaultProvince = response.data.find(
                        (p: Province) => p.name === 'Hà Nội'
                    );
                    if (defaultProvince) {
                        setSelectedProvince(defaultProvince);
                        await fetchDistricts(defaultProvince.code);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    const handleFilter = async (clear: boolean) => {
        setIsLoading(true);
        console.log(selectedDistrict, selectedProvince?.name);
        const query: any = {
            status: 'active',
            page: currentPage,
            limit: pageSize,
            postType: type === 'sell' ? 'sell' : 'rent',
            ...(!clear && selectedDistrict && { district: selectedDistrict }),
            ...(!clear &&
                selectedProvince && { province: selectedProvince.name }),
        };

        try {
            const response = await getPost(query);
            if (response) {
                setPosts(response.data.posts);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setShowPopover(false);
            setIsLoading(false);
        }
    };

    const popoverContent = (
        <div className="w-full">
            <span className="block mb-1 font-medium">
                Chọn tỉnh / thành phố:
            </span>
            <Select
                showSearch
                className="w-full mb-3"
                value={selectedProvince?.code}
                onChange={(value) => {
                    const province = provinceData.find((p) => p.code === value);
                    setSelectedProvince(province || null);
                    setSelectedDistrict(undefined);
                    if (province) {
                        fetchDistricts(province.code);
                    }
                }}
            >
                {provinceData.map((province) => (
                    <Select.Option key={province.code} value={province.code}>
                        {province.name}
                    </Select.Option>
                ))}
            </Select>

            <span className="block mb-1 font-medium">Chọn quận / huyện:</span>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-auto text-sm text-gray-800">
                {districtData.map((district) => (
                    <div
                        key={district.code}
                        className={`cursor-pointer hover:underline ${
                            selectedDistrict === district.name
                                ? 'text-blue-600 font-medium'
                                : ''
                        }`}
                        onClick={() => {
                            setSelectedDistrict(district.name);
                            console.log(district);
                            setShowPopover(false);
                        }}
                    >
                        {district.name}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 w-full">
            <Popover
                content={popoverContent}
                trigger="click"
                open={showPopover}
                onOpenChange={setShowPopover}
                placement="bottomLeft"
                styles={{
                    body: {
                        width: searchRef.current?.offsetWidth || 300,
                    },
                }}
            >
                <div ref={searchRef}>
                    <Input.Search
                        allowClear
                        className="w-full"
                        placeholder="Tìm kiếm bài đăng..."
                        onClick={() => setShowPopover(true)}
                        onSearch={() => handleFilter(false)}
                        value={selectedDistrict || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value) {
                                setSelectedDistrict(undefined);
                                setSelectedProvince(null);
                                setDistrictData([]);
                                handleFilter(true);
                            }
                        }}
                    />
                </div>
            </Popover>
        </div>
    );
};

export default SearchPostPage;
