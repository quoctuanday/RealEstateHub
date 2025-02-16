'use client';
import { getUser } from '@/api/api';
import { User } from '@/schema/User';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function HomePage() {
    const searchParams = useSearchParams();
    const [userLoginData, setUserLoginData] = useState<User>();
    useEffect(() => {
        if (searchParams) {
            const params = new URLSearchParams(searchParams);
            const accessToken = params.get('accessToken');
            if (accessToken) {
                sessionStorage.setItem('token', accessToken);
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUser();
                if (response) {
                    console.log(response.data);
                    const userData = JSON.stringify(response.data);
                    localStorage.setItem('userLoginData', userData);
                    const storedUser = localStorage.getItem('userLoginData');
                    if (storedUser) {
                        setUserLoginData(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="">
                {userLoginData?.userName}, {userLoginData?.email}
                <Image
                    src={
                        userLoginData?.image
                            ? userLoginData.image
                            : '/images/logo.jpg'
                    }
                    alt=""
                    width={900}
                    height={900}
                    className="w-[100px] h-[100px] rounded-full"
                ></Image>
            </div>
        </>
    );
}

export default HomePage;
