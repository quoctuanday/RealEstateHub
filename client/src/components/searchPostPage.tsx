/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getProvince } from '@/api/serverApi';
import { Select, Popover, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface Ward {
    name: string;
    mergedFrom?: string[];
}

interface Province {
    province: string;
    wards: Ward[];
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
    const [wardData, setWardData] = useState<Ward[]>([]);
    const [selectedWard, setSelectedWard] = useState<string | undefined>();
    const [showPopover, setShowPopover] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getProvince();
                if (response?.data) {
                    setProvinceData(response.data.data);

                    const defaultProvince = response.data.data.find(
                        (p: Province) => p.province === 'Hà Nội'
                    );
                    if (defaultProvince) {
                        setSelectedProvince(defaultProvince);
                        setWardData(defaultProvince.wards);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    const applySearch = () => {
        const cleanedWard =
            selectedWard?.replace(/^(Phường|Xã|Thị trấn)\s+/i, '') || '';
        setQuery((prev: any) => ({
            ...prev,
            province: selectedProvince?.province,
            district: cleanedWard,
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
                value={selectedProvince?.province}
                onChange={(value) => {
                    const province = provinceData.find(
                        (p) => p.province === value
                    );
                    setSelectedProvince(province || null);
                    setSelectedWard(undefined);
                    if (province) setWardData(province.wards);
                }}
                options={provinceData.map((p) => ({
                    label: p.province,
                    value: p.province,
                }))}
            />

            <span className="block mb-1 font-medium">Chọn phường / xã:</span>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-auto text-sm text-gray-800">
                {wardData.map((ward, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer hover:underline ${
                            selectedWard === ward.name
                                ? 'text-blue-600 font-medium'
                                : ''
                        }`}
                        onClick={() => setSelectedWard(ward.name)}
                    >
                        {ward.name}
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
                        value={selectedWard || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value) {
                                setSelectedWard(undefined);
                                setSelectedProvince(null);
                                setWardData([]);
                                setQuery((prev: any) => ({
                                    ...prev,
                                    ward: undefined,
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
