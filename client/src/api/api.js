import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URL });
const api_map = axios.create({ baseURL: 'https://provinces.open-api.vn/api' });
export default api;

async function refreshAccessToken() {
    try {
        const response = await api.post(
            '/users/refreshToken',
            {},
            {
                withCredentials: true,
            }
        );

        const accessToken = response.data.accessToken;
        console.log(accessToken);
        return accessToken;
    } catch (error) {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.error('Refresh token has expired or is invalid.');
            localStorage.clear();
            window.location.href = '/login';
        } else {
            console.error('Failed to refresh access token:', error);
        }
        throw error;
    }
}

//Send request with authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//take response and handle
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            localStorage.setItem('token', newAccessToken);
            originalRequest.headers[
                'Authorization'
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
        }
        if (error.response.status === 403) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

//User
export const login = (data) =>
    api.post('/users/login', { data }, { withCredentials: true });
export const getUser = () => api.get('/users/getUser');
export const getAllUser = (data = {}) =>
    api.get('/users/getAllUser', { params: data });
export const logout = () => api.get('/users/logout', { withCredentials: true });
export const changePassword = (data) =>
    api.put('/users/changePassword', { data });
export const createUser = (data) =>
    api.post('/users/createUser', {
        data,
    });
export const updateUser = (data) => api.put('/users/updateOne', { data });
export const updateUsers = (data) => api.put('/users/updateMany', { data });

//Payment
export const checkOut = (data) => api.post('/payment/vnpay/create', { data });
export const updateCheckout = (query, data) =>
    api.put(`/payment/vnpay/callback?${query}`, { data });

//Post
export const createPost = (data) => api.post('/posts/create', { data });
export const addFavourite = (data) => api.post('/posts/addFavourite', { data });
export const updatePost = (data, id) =>
    api.put(`/posts/update/${id}`, { data });
export const getPost = (data = {}) =>
    api.get('/posts/getPost', { params: data });
export const getFavourite = () => api.get('/posts/getFavourite');

//Map
export const getProvince = () => api_map.get('/p/');
export const getDistrict = (code) => api_map.get(`/p/${code}?depth=3`);

//ChatGPT
export const generateTitle = (data) =>
    api.post('/chatGPT/generateTitle', { data });

//Notifications
export const getNotify = () => api.get('/notification/get');
export const updateNotify = (id, data) =>
    api.put(`/notification/update/${id}`, { data });

//Category
export const createCategory = (data) => api.post('/category/create', { data });
export const updateCategory = (id, data) =>
    api.put(`/category/update/${id}`, { data });
export const getCategory = () => api.get('/category/get');

//Statitic
export const getCount = (start, end) =>
    api.get(`/admin/getCount?start=${start}&end=${end}`);
export const getRevenue = (start, end) =>
    api.get(`/admin/getRevenue?start=${start}&end=${end}`);

//News personal
export const createNews = (data) => api.post('/news/createNews', { data });
export const updateNews = (id, data) =>
    api.put(`/news/updateNews/${id}`, { data });
export const forceDeletedNews = (newsId) =>
    api.delete(`/news/forceDelete/${newsId}`);
export const getAllNews = (data = {}) =>
    api.get('/news/getAllNews', { params: data });

//Comment
export const createComment = (data) => api.post('/comment/create', { data });
export const getComment = (id) => api.get(`/comment/get/${id}`);
export const deleteComment = (id) => api.delete(`/comment/delete/${id}`);
export const blockComment = (id) => api.put(`/comment/block/${id}`);

//Chatbot
export const chatBot = (data) => api.post('/chatBot', { data });

//Legal documents
export const createDocument = (data) => api.post('/documents/create', { data });
export const getDocuments = (data = {}) =>
    api.get('/documents', { params: data });
export const deleteDocument = (documentId) =>
    api.delete(`/documents/delete/${documentId}`);
