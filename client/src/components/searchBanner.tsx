'use client';
import { useEffect, useState } from 'react';
import { getDistrict, getProvince } from '@/api/api';
import { useRouter } from 'next/navigation';
import { Select, Button } from 'antd';

interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

export default function BannerSearch() {
    const router = useRouter();
    const [postType, setPostType] = useState<'sell' | 'rent'>('sell');
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [provinceCode, setProvinceCode] = useState<number | null>(null);
    const [districtName, setDistrictName] = useState<string>('');

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvince();
            if (res) setProvinces(res.data);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!provinceCode) return;
            const res = await getDistrict(provinceCode);
            if (res) setDistricts(res.data.districts);
        };
        fetchDistricts();
    }, [provinceCode]);

    const handleSearch = () => {
        const query = new URLSearchParams();
        if (districtName) query.set('district', districtName);
        if (provinceCode) {
            const selectedProvince = provinces.find(
                (p) => p.code === provinceCode
            );
            if (selectedProvince) query.set('province', selectedProvince.name);
        }
        router.push(`/${postType}?${query.toString()}`);
    };

    return (
        <div className="bg-white/90 p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-3 items-center w-[90%] max-w-3xl">
            <Select
                value={postType}
                onChange={(value) => setPostType(value)}
                className="w-full sm:w-40"
                options={[
                    { label: 'Mua bán', value: 'sell' },
                    { label: 'Cho thuê', value: 'rent' },
                ]}
            />
            <Select
                showSearch
                placeholder="Chọn tỉnh / thành phố"
                value={provinceCode || undefined}
                onChange={(value) => {
                    setProvinceCode(value);
                    setDistrictName('');
                }}
                className="w-full"
                options={provinces.map((p) => ({
                    label: p.name,
                    value: p.code,
                }))}
            />
            <Select
                showSearch
                placeholder="Chọn quận / huyện"
                value={districtName || undefined}
                onChange={(value) => setDistrictName(value)}
                className="w-full"
                disabled={!districts.length}
                options={districts.map((d) => ({
                    label: d.name,
                    value: d.name,
                }))}
            />
            <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
            </Button>
        </div>
    );
}
