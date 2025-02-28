import TitleComponent from '@/components/title';

export default function InfoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-[1.25rem]">
            <TitleComponent title="Quản lí tài khoản" />
            <div className="flex justify-center bg-hoverColor pb-[1.25rem]">
                <div className="mt-[1.25rem] p-[1.25rem] w-[50rem] rounded bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}
