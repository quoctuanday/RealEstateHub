import PostDetailContent from './PostDetailContent';

export default function PostDetailPage({ params }: { params: { id: string } }) {
    return <PostDetailContent id={params.id} />;
}
