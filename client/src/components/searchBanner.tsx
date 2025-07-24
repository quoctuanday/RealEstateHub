'use client';
import { useEffect, useState } from 'react';
import { getProvince } from '@/api/api';
import { useRouter } from 'next/navigation';
import { Select, Button } from 'antd';

interface Ward {
    name: string;
    mergedFrom?: string[];
}

interface Province {
    province: string;
    wards: Ward[];
}

export default function BannerSearch() {
    const router = useRouter();
    const [postType, setPostType] = useState<'sell' | 'rent'>('sell');
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [provinceName, setProvinceName] = useState<string>('');
    const [wards, setWards] = useState<Ward[]>([]);
    const [wardName, setWardName] = useState<string>('');

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvince();
            if (res?.data) setProvinces(res.data.data);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!provinceName) return;
        const selected = provinces.find((p) => p.province === provinceName);
        setWards(selected ? selected.wards : []);
        setWardName('');
    }, [provinceName, provinces]);

    const handleSearch = () => {
        const query = new URLSearchParams();
        if (provinceName) query.set('province', provinceName);
        if (wardName) query.set('district', wardName);
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
                value={provinceName || undefined}
                onChange={(value) => setProvinceName(value)}
                className="w-full"
                options={provinces.map((p) => ({
                    label: p.province,
                    value: p.province,
                }))}
            />
            <Select
                showSearch
                placeholder="Chọn phường / xã"
                value={wardName || undefined}
                onChange={(value) => setWardName(value)}
                className="w-full"
                disabled={!wards.length}
                options={wards.map((w) => ({
                    label: w.name,
                    value: w.name,
                }))}
            />
            <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
            </Button>
        </div>
    );
}
