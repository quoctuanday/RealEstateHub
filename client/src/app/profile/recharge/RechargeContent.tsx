'use client';
import { getUser, updateCheckout } from '@/api/api';
import { useUser } from '@/store/store';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

function RechargeContent() {
    const { setUserLoginData } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchInitialData = async () => {
        try {
            const response = await getUser();
            if (response) {
                const userData = JSON.stringify(response.data);
                localStorage.setItem('userLoginData', userData);
                const storedUser = localStorage.getItem('userLoginData');
                if (storedUser) {
                    setUserLoginData(JSON.parse(storedUser));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                    await fetchInitialData();
                } catch (error) {
                    console.error(error);
                }
            };
            fetchCallback();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="px-[3rem] mt-[1.25rem]">
            <h2>Chọn 1 trong các hình thức thanh toán dưới đây:</h2>
            <div className="grid grid-cols-3 gap-3 mt-[1.25rem]">
                <div
                    onClick={() => router.push('/profile/recharge/Amount')}
                    className="col-span-1 border rounded flex items-center p-4 hover:shadow-custom-light cursor-pointer"
                >
                    <Image
                        src="/images/vnpay.svg"
                        alt="logo vnpay"
                        width={100}
                        height={100}
                        className="w-[3rem] h-[3rem]"
                    />
                    <span className="ml-2">Thanh toán bằng VNPAY</span>
                </div>
            </div>
        </div>
    );
}

export default RechargeContent;
