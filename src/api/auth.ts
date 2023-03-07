import api from '@/api';

export const registerUser = async (user = {}) => await api.post('register', user);

export const loginUser = async (user = {}) => await api.post('login', user);
