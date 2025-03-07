'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

function ManagePostpage() {
    const router = useRouter();

    return (
        <div className="h-full">
            <h1 className="roboto-bold mt-[1.25rem]">Danh sách tin đăng</h1>
            <div className="flex flex-col items-center justify-end w-full h-[20rem]">
                <span>Bạn chưa đăng tin nào!</span>
                <Button
                    type="primary"
                    className="mt-2"
                    htmlType="button"
                    onClick={() => router.push('/post')}
                >
                    Đăng tin
                </Button>
            </div>
        </div>
    );
}

export default ManagePostpage;
