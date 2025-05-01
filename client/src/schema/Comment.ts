export type Comments = {
    _id: string;
    userId: string;
    postId?: string;
    userName: string;
    image?: string;
    content: string;
    rate: number;
    isBlocked: boolean;
    createdAt?: string;
    updatedAt?: string;
};
