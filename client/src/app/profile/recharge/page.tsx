'use client';
import { updateCheckout } from '@/api/api';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

function RechargePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams) {
            const fetchCallback = async () => {
                try {
                    const query = new URLSearchParams(searchParams).toString();
                    const response = await updateCheckout(query, {
                        type: true,
                    });
                    if (response) {
                        window.history.replaceState(
                            {},
                            document.title,
                            window.location.pathname
                        );
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchCallback();
        }
    }, [searchParams]);
    return (
        <div className="px-[3rem] mt-[1.25rem]">
            <h2>Chọn 1 trong các hình thức thanh toán dưới đây:</h2>
            <div className="grid grid-cols-3 gap-3 mt-[1.25rem]">
                <div
                    onClick={() => {
                        router.push('/profile/recharge/Amount');
                    }}
                    className="col-span-1 border rounded flex items-center p-4 hover:shadow-custom-light cursor-pointer"
                >
                    <Image
                        src={'/images/vnpay.svg'}
                        alt="logo vnpay"
                        width={100}
                        height={100}
                        className="w-[3remrem] h-[3remrem]"
                    ></Image>
                    <span className="ml-2">Thanh toán bằng VNPAY</span>
                </div>
            </div>
        </div>
    );
}

export default RechargePage;
