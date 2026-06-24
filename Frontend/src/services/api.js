import axios from 'axios';

const API = axios.create({
    baseURL: 'https://codealpha-ecommerce-website.onrender.com/api'
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- AUTH API ---
export const login = async (email, password) => {
    const { data } = await API.post('/users/login', { email, password });
    return data;
};

export const register = async (name, email, password) => {
    const { data } = await API.post('/users/register', { name, email, password });
    return data;
};

export const getAllUsers = async () => {
    const { data } = await API.get('/users/users');
    return data;
};

// --- PRODUCTS API ---
export const getProducts = async () => {
    const { data } = await API.get('/products');
    return data;
};

export const getProductById = async (id) => {
    const { data } = await API.get(`/products/${id}`);
    return data;
};

export const createProduct = async (productData) => {
    const { data } = await API.post('/products', productData);
    return data;
};

export const updateProduct = async (id, productData) => {
    const { data } = await API.put(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await API.delete(`/products/${id}`);
    return data;
};

// --- UPLOAD API ---
export const uploadImage = async (formData) => {
    const { data } = await API.post('/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

// --- ORDERS API ---
export const createOrder = async (orderData) => {
    const { data } = await API.post('/orders', orderData);
    return data;
};

export const getOrderById = async (id) => {
    const { data } = await API.get(`/orders/${id}`);
    return data;
};

export const payOrder = async (id, paymentResult) => {
    const { data } = await API.put(`/orders/${id}/pay`, paymentResult);
    return data;
};

export const getMyOrders = async () => {
    const { data } = await API.get('/orders/myorders');
    return data;
};

export const getOrders = async () => {
    const { data } = await API.get('/orders');
    return data;
};

export const deliverOrder = async (id) => {
    const { data } = await API.put(`/orders/${id}/deliver`);
    return data;
};

// --- PAYMENTS API (RAZORPAY) ---
export const createRazorpayOrder = async (amount) => {
    const { data } = await API.post('/payments/order', { amount });
    return data;
};

export const verifyRazorpayPayment = async (paymentData) => {
    const { data } = await API.post('/payments/verify', paymentData);
    return data;
};
