'use client';
import FooterPage from '@/components/footer';
import TitleComponent from '@/components/title';

export default function RechargeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-[1.25rem]">
            <TitleComponent title="Nạp tiền vào tài khoản" />
            <div className="min-h-[30rem]">{children}</div>
            <FooterPage />
        </div>
    );
}
