import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
});

// Ambil token dari localStorage dan set ke headers
const token = localStorage.getItem('token');
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
