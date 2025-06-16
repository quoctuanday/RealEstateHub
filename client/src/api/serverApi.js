import axios from 'axios';

const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 10000,
});

export const serverGetAllNews = (params = {}) =>
    serverApi.get('/news/getAllNews', { params });

//User
export const serverGetUser = () => serverApi.get('/users/getUser');
export const serverGetAllUser = (data = {}) =>
    serverApi.get('/users/getAllUser', { params: data });

//Post
export const serverGetPost = (data = {}) =>
    serverApi.get('/posts/getPost', { params: data });
export const serverGetFavourite = () => serverApi.get('/posts/getFavourite');
export const serverGetTransactionHistory = (data) =>
    serverApi.get('/posts/transactionHistory', { data });

//Notifications
export const serverGetNotify = () => serverApi.get('/notification/get');

//Category
export const serverGetCategory = () => serverApi.get('/category/get');
