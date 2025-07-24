import PostRentDetailPage from '@/app/(main)/rent/[id]/RentDetailContent';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <PostRentDetailPage id={id} />;
}
