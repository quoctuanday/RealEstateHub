export type Category = {
    _id: string;
    name: string;
    childCate: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};
