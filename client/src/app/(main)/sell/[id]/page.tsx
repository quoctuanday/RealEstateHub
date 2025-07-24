import PostDetailContent from '@/app/(main)/sell/[id]/PostDetailContent';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <PostDetailContent id={id} />;
}
