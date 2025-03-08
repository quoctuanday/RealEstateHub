'use client';
import { getProvince, getDistrict } from '@/api/api';
import GoongMap from '@/components/mapBox';
import { Button, Input, InputRef, Radio, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    setFormAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setAddressLocation: React.Dispatch<React.SetStateAction<Adress | null>>;
}

type Ward = {
    code: number;
    codename: string;
    district_code: number;
    division_type: string;
    name: string;
};

type District = {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    province_code: number;
    wards: Ward[];
};

type Province = {
    code: number;
    codename: string;
    districts: District[];
    division_type: string;
    name: string;
    phone_code: number;
};

interface Adress {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

function AddressChoose({ setFormAddress, setAddressLocation }: Props) {
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(
        null
    );
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
        null
    );
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
    const [address, setAddress] = useState('');
    const [addressForMap, setAddressForMap] = useState('');
    const addressPostRef = useRef<InputRef>(null);

    useEffect(() => {
        const getData = async () => {
            const response = await getProvince();
            if (response) {
                console.log(response.data);
                setFilteredProvinces(response.data);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedWard) {
            setAddress(
                `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
            );
            setAddressForMap(
                `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
            );
        }
    }, [selectedProvince, selectedDistrict, selectedWard]);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                const districtResponse = await getDistrict(
                    selectedProvince.code
                );
                if (districtResponse) {
                    setFilteredDistricts(districtResponse.data.districts);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                }
            };
            fetchDistricts();
        } else {
            setFilteredDistricts([]);
            setSelectedDistrict(null);
            setSelectedWard(null);
        }
    }, [selectedProvince]);

    return (
        <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 z-30 roboto-regular text-[1rem]">
            <div
                className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-black"
                onClick={() => setFormAddress(false)}
            ></div>
            <div
                className="relative children w-[52rem] max-h-[40rem] overflow-y-auto overflow-hidden min-h-[16rem] bg-white rounded-[10px] shadow-custom-light p-[1rem]
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
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">Tỉnh/ Thành phố</h2>
                    <Select
                        placeholder="Chọn tỉnh/thành"
                        value={
                            selectedProvince ? selectedProvince.code : undefined
                        }
                        showSearch
                        className="w-full mt-1"
                        onChange={(value) => {
                            const selected = filteredProvinces.find(
                                (p) => p.code === value
                            );
                            setSelectedProvince(selected || null);
                            setSelectedDistrict(null);
                            setSelectedWard(null);
                        }}
                        optionFilterProp="search"
                        filterOption={(input, option) => {
                            if (!option?.search) return false;
                            return (option.search as string)
                                .toLowerCase()
                                .includes(input.toLowerCase());
                        }}
                        options={filteredProvinces.map((province) => ({
                            key: province.codename,
                            value: province.code,
                            search: province.name,
                            label: (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{province.name}</span>
                                    <Radio
                                        checked={
                                            selectedProvince?.code ===
                                            province.code
                                        }
                                    />
                                </div>
                            ),
                        }))}
                    />
                </div>
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">Quận/ Huyện</h2>
                    <Select
                        placeholder="Chọn quận/ huyện"
                        value={
                            selectedDistrict ? selectedDistrict.code : undefined
                        }
                        showSearch
                        className="w-full mt-1"
                        onChange={(value) => {
                            const selected = filteredDistricts.find(
                                (d) => d.code === value
                            );
                            setSelectedDistrict(selected || null);
                            setSelectedWard(null);
                        }}
                        optionFilterProp="search"
                        filterOption={(input, option) => {
                            if (!option?.search) return false;
                            return (option.search as string)
                                .toLowerCase()
                                .includes(input.toLowerCase());
                        }}
                        options={filteredDistricts.map((district) => ({
                            key: district.codename,
                            value: district.code,
                            search: district.name,
                            label: (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{district.name}</span>
                                    <Radio
                                        checked={
                                            selectedDistrict?.code ===
                                            district.code
                                        }
                                    />
                                </div>
                            ),
                        }))}
                    />
                </div>
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">Phường/ Xã</h2>
                    <Select
                        placeholder="Chọn phường/ xã"
                        value={selectedWard ? selectedWard.code : undefined}
                        showSearch
                        className="w-full mt-1"
                        onChange={(value) => {
                            if (selectedDistrict) {
                                const selected = selectedDistrict.wards.find(
                                    (w) => w.code === value
                                );
                                setSelectedWard(selected || null);
                            }
                        }}
                        optionFilterProp="search"
                        filterOption={(input, option) => {
                            if (!option?.search) return false;
                            return (option.search as string)
                                .toLowerCase()
                                .includes(input.toLowerCase());
                        }}
                        options={
                            selectedDistrict
                                ? selectedDistrict.wards.map((ward) => ({
                                      key: ward.codename,
                                      value: ward.code,
                                      search: ward.name,
                                      label: (
                                          <div
                                              style={{
                                                  display: 'flex',
                                                  justifyContent:
                                                      'space-between',
                                              }}
                                          >
                                              <span>{ward.name}</span>
                                              <Radio
                                                  checked={
                                                      selectedWard?.code ===
                                                      ward.code
                                                  }
                                              />
                                          </div>
                                      ),
                                  }))
                                : []
                        }
                    />
                </div>
                <div className="mt-[1.25rem]">
                    <h2 className="roboto-bold">
                        Địa chỉ hiển thị trên tin đăng
                    </h2>
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
                    ></Input>
                </div>
                {addressForMap && (
                    <div className="mt-[1.25rem]">
                        <GoongMap
                            address={addressForMap}
                            setLocation={setAddressLocation}
                        />
                    </div>
                )}

                <Button
                    type="primary"
                    htmlType="button"
                    className="mt-2"
                    onClick={() => {
                        if (addressPostRef.current) {
                            setAddressLocation((prev) => ({
                                name:
                                    addressPostRef.current?.input?.value ?? '',
                                coordinates: {
                                    latitude:
                                        prev?.coordinates.latitude ?? 21.028,
                                    longitude:
                                        prev?.coordinates.longitude ??
                                        105.83991,
                                },
                            }));
                            setFormAddress(false);
                        }
                    }}
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    );
}

export default AddressChoose;
