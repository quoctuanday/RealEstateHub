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
export const logout = () => api.get('/users/logout', { withCredentials: true });
export const changePassword = (data) =>
    api.put('/users/changePassword', { data });
export const createUser = (data) =>
    api.post('/users/createUser', {
        data,
    });
export const updateUser = (data) => api.put('/users/updateOne', { data });

//Payment
export const checkOut = (data) => api.post('/payment/vnpay/create', { data });
export const updateCheckout = (query, data) =>
    api.put(`/payment/vnpay/callback?${query}`, { data });

//Post
export const createPost = (data) => api.post('/posts/create', { data });

//Map
export const getProvince = () => api_map.get('/p/');
export const getDistrict = (code) => api_map.get(`/p/${code}?depth=3`);
