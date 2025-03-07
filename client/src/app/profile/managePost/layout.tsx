'use client';
import FooterPage from '@/components/footer';
import TitleComponent from '@/components/title';

export default function postLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-[1.25rem]">
            <TitleComponent title="Quản lí bài đăng" />
            <div className="px-[3rem] min-h-[30rem]">{children}</div>
            <FooterPage />
        </div>
    );
}
