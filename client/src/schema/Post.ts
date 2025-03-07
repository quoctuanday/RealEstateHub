export type Post = {
    _id: string;
    userId: string;
    userName?: string;
    title: string;
    images: string;
    phoneNumber: string;
    email: string;
    description: string;
    location: {
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    isCheckout?: boolean;
    urlSaveImages: string;
    price: number;
    acreage: number;
    postType: string;
    houseType: string;
    rate: number;
    feedBack?: string;
    isAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
};
