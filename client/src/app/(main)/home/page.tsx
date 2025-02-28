'use client';
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
            <div className=""></div>
        </>
    );
}

export default HomePage;
