/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getDistrict, getProvince } from '@/api/api';
import { Select, Popover, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface District {
    code: number;
    name: string;
}

interface Province {
    code: number;
    name: string;
    districts: District[];
}

interface Props {
    setQuery: React.Dispatch<React.SetStateAction<any>>;
}

const SearchPostPage: React.FC<Props> = ({ setQuery }) => {
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

    const applySearch = () => {
        setQuery((prev: any) => ({
            ...prev,
            province: selectedProvince?.name,
            district: selectedDistrict,
            page: 1,
        }));
        setShowPopover(false);
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
                    if (province) fetchDistricts(province.code);
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
                        onClick={() => setSelectedDistrict(district.name)}
                    >
                        {district.name}
                    </div>
                ))}
            </div>

            <button
                className="mt-3 bg-blue-500 text-white px-4 py-1 rounded"
                onClick={applySearch}
            >
                Áp dụng
            </button>
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
                    body: { width: searchRef.current?.offsetWidth || 300 },
                }}
            >
                <div ref={searchRef}>
                    <Input.Search
                        allowClear
                        className="w-full"
                        placeholder="Tìm kiếm bài đăng..."
                        onClick={() => setShowPopover(true)}
                        value={selectedDistrict || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value) {
                                setSelectedDistrict(undefined);
                                setSelectedProvince(null);
                                setDistrictData([]);
                                setQuery((prev: any) => ({
                                    ...prev,
                                    district: undefined,
                                    province: undefined,
                                    page: 1,
                                }));
                            }
                        }}
                        onSearch={applySearch}
                    />
                </div>
            </Popover>
        </div>
    );
};

export default SearchPostPage;
