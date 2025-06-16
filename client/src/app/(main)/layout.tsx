import FooterPage from '@/components/footer';
import DraggableChatbot from '@/components/draggableChatBot';
import ClientHeader from '@/components/clientHeader';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ClientHeader />
            <main>{children}</main>
            <DraggableChatbot />
            <div className="w-full h-[10rem]"></div>
            <FooterPage />
        </>
    );
}
