export type Post = {
    _id: string;
    userId?: string;
    userName?: string;
    userImage?: string;
    title: string;
    images: string[];
    phoneNumber: string;
    email: string;
    description: string;
    location?: {
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    features?: {
        bathroom: number;
        room: number;
        convenients: string[];
    };
    duration: number;
    view: number;
    expiredAt?: string;
    isCheckout?: boolean;
    urlSaveImages: string;
    price: number;
    acreage: number;
    postType: string;
    houseType: string;
    rate: number;
    feedBack?: string;
    status: string;
    isFavourite?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
