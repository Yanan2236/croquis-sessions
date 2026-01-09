import { api } from '@/lib/api';

export const fetchCurrentUser = async () => {
    try {
        const { data } = await api.get('/accounts/me/');
        return data;
    } catch (err: any) {
        if (err.response?.status === 401) return null;
        throw err;
    }
};