'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function HandleAccessToken() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) {
            const accessToken = searchParams.get('accessToken');
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

    return null;
}
