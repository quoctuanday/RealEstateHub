/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Form, Select } from 'antd';
import React, { useState } from 'react';

interface Props {
    setQuery: React.Dispatch<React.SetStateAction<any>>;
}

function FilterPostPage({ setQuery }: Props) {
    const [filters, setFilters] = useState({
        houseType: [] as string[],
    });

    const houseTypes = [
        { id: 1, name: 'Chung cư' },
        { id: 2, name: 'Condotel' },
        { id: 3, name: 'Biệt thự' },
        { id: 4, name: 'Nhà cấp 4' },
        { id: 5, name: 'Nhà mặt phố' },
        { id: 6, name: 'Kho, xưởng' },
    ];

    const handleFilter = () => {
        setQuery((prev: any) => ({
            ...prev,
            houseType: filters.houseType,
            page: 1,
        }));
    };

    return (
        <Form>
            <h1 className="roboto-bold">Lọc theo</h1>
            <div className="flex gap-4 flex-wrap">
                <div>
                    <span>Loại nhà:</span>
                    <Select
                        mode="multiple"
                        allowClear
                        className="ml-2 w-[15rem]"
                        placeholder="Chọn loại nhà"
                        onChange={(value) =>
                            setFilters((prev) => ({
                                ...prev,
                                houseType: value,
                            }))
                        }
                        options={houseTypes.map((type) => ({
                            label: type.name,
                            value: type.name,
                        }))}
                    />
                </div>

                <Button type="primary" onClick={handleFilter}>
                    Lọc
                </Button>
            </div>
        </Form>
    );
}

export default FilterPostPage;
