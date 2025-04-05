'use client';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function HomePage() {
    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams) {
            const params = new URLSearchParams(searchParams);
            const accessToken = params.get('accessToken');
            if (accessToken) {
                localStorage.setItem('token', accessToken);
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }
        }
    }, [searchParams]);

    return (
        <>
            <div className="">
                <div className="w-full h-[20rem] bg-blue-200">
                    <Image
                        src={'/images/banner.webp'}
                        alt="banner"
                        width={800}
                        height={800}
                        priority
                        className="w-full"
                    />
                </div>
            </div>
        </>
    );
}

export default HomePage;
