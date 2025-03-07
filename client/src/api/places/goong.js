// goongApi.js
import axios from 'axios';

const goongApi = axios.create({
    baseURL: 'https://rsapi.goong.io',
});

goongApi.interceptors.request.use(
    (config) => {
        const apiKey = process.env.NEXT_PUBLIC_MAP_API;
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                api_key: apiKey,
            };
        } else {
            config.data = {
                ...config.data,
                api_key: apiKey,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default goongApi;

export const autoComplete = (params) => {
    return goongApi.get('/Place/AutoComplete', { params });
};

export const getPlaceDetail = (params) => {
    return goongApi.get('/Place/Detail', { params });
};

export const getMapBox = (params) => {
    return goongApi.get('/Geocode', { params });
};
