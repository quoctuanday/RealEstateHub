import SidebarAdmin from '@/components/sidebarAmin';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid grid-cols-10 bg-[#f4f3f8]">
            <div className="col-span-2">
                <SidebarAdmin />
            </div>
            <div className="col-span-8">
                <div className="h-[3rem] bg-rootColor"></div>

                <div className="max-h-[100vh] overflow-x-auto">{children}</div>
            </div>
        </div>
    );
}
