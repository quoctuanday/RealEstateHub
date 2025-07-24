'use client';

import { getProvince } from '@/api/serverApi';
import GoongMap from '@/components/mapBox';
import { Button, Input, InputRef, Radio, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    setFormAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setAddressLocation: React.Dispatch<React.SetStateAction<Adress | null>>;
}

type Ward = {
    name: string;
    mergedFrom?: string[];
};

type Province = {
    province: string;
    wards: Ward[];
};

interface Adress {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

function AddressChoose({ setFormAddress, setAddressLocation }: Props) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(
        null
    );
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [address, setAddress] = useState('');
    const [addressForMap, setAddressForMap] = useState('');
    const addressPostRef = useRef<InputRef>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getProvince();
            if (res?.data?.data) {
                setProvinces(res.data.data);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedProvince && selectedWard) {
            const fullAddress = `${selectedWard.name}, ${selectedProvince.province}`;
            setAddress(fullAddress);
            setAddressForMap(fullAddress);
        }
    }, [selectedProvince, selectedWard]);

    const handleConfirm = () => {
        if (addressPostRef.current) {
            setAddressLocation({
                name: addressPostRef.current.input?.value ?? '',
                coordinates: {
                    latitude: 0,
                    longitude: 0,
                },
            });
            setFormAddress(false);
        }
    };

    return (
        <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 z-30 roboto-regular text-[1rem]">
            <div
                className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-black"
                onClick={() => setFormAddress(false)}
            ></div>
            <div
                className="relative appear w-[52rem] max-h-[40rem] overflow-y-auto overflow-hidden min-h-[16rem] bg-white rounded-[10px] shadow-custom-light p-[1rem]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-[10px]
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-[10px]
        [&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
                <div className="border-b flex items-center justify-between pb-[1.25rem]">
                    <h1 className="roboto-bold text-[1.25rem]">Chọn địa chỉ</h1>
                    <Button
                        htmlType="button"
                        color="danger"
                        variant="outlined"
                        icon={<IoCloseOutline />}
                        onClick={() => setFormAddress(false)}
                    />
                </div>

                {/* Province */}
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">Tỉnh / Thành phố</h2>
                    <Select
                        className="w-full mt-1"
                        placeholder="Chọn tỉnh/thành"
                        value={selectedProvince?.province}
                        showSearch
                        onChange={(value) => {
                            const found = provinces.find(
                                (p) => p.province === value
                            );
                            setSelectedProvince(found || null);
                            setSelectedWard(null);
                        }}
                        optionFilterProp="search"
                        filterOption={(input, option) => {
                            if (!option?.search) return false;
                            return (option.search as string)
                                .toLowerCase()
                                .includes(input.toLowerCase());
                        }}
                        options={provinces.map((province) => ({
                            key: province.province,
                            value: province.province,
                            search: province.province,
                            label: (
                                <div className="flex justify-between">
                                    <span>{province.province}</span>
                                    <Radio
                                        checked={
                                            selectedProvince?.province ===
                                            province.province
                                        }
                                    />
                                </div>
                            ),
                        }))}
                    />
                </div>

                {/* Ward */}
                {selectedProvince && (
                    <div className="mt-[1.25rem]">
                        <h2 className="roboto-bold">Phường / Xã</h2>
                        <Select
                            className="w-full mt-1"
                            placeholder="Chọn phường/xã"
                            value={selectedWard?.name}
                            showSearch
                            onChange={(value) => {
                                const found = selectedProvince.wards.find(
                                    (w) => w.name === value
                                );
                                setSelectedWard(found || null);
                            }}
                            optionFilterProp="search"
                            filterOption={(input, option) => {
                                if (!option?.search) return false;
                                return (option.search as string)
                                    .toLowerCase()
                                    .includes(input.toLowerCase());
                            }}
                            options={selectedProvince.wards.map((ward) => ({
                                key: ward.name,
                                value: ward.name,
                                search: ward.name,
                                label: (
                                    <div className="flex justify-between">
                                        <span>{ward.name}</span>
                                        <Radio
                                            checked={
                                                selectedWard?.name === ward.name
                                            }
                                        />
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                )}

                {/* Hiển thị địa chỉ */}
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">Địa chỉ hiển thị</h2>
                    <Input
                        ref={addressPostRef}
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressLocation((prev) => ({
                                ...prev,
                                name: e.target.value,
                                coordinates: prev?.coordinates ?? {
                                    latitude: 0,
                                    longitude: 0,
                                },
                            }));
                        }}
                        placeholder="Địa chỉ hiển thị"
                    />
                </div>

                {/* Bản đồ nếu có */}
                {addressForMap && (
                    <div className="mt-[1.25rem]">
                        <GoongMap
                            address={addressForMap}
                            setLocation={setAddressLocation}
                        />
                    </div>
                )}

                {/* Nút xác nhận */}
                <Button
                    type="primary"
                    htmlType="button"
                    className="mt-2"
                    onClick={handleConfirm}
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    );
}

export default AddressChoose;
