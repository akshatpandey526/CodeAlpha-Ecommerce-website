import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CartView from './components/CartView';
import AuthView from './components/AuthView';
import OrdersView from './components/OrdersView';
import AdminDashboard from './components/AdminDashboard';
import {
    login,
    register,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createOrder,
    payOrder,
    getMyOrders,
    getOrders,
    deliverOrder,
    createRazorpayOrder,
    verifyRazorpayPayment
} from './services/api';

function App() {
    // Application States
    const [view, setView] = useState('home'); // home, product, cart, login, register, orders, admin
    const [products, setProducts] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
    const [myOrders, setMyOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    
    // Auth Forms States
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authError, setAuthError] = useState('');

    // Shipping Address State
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    // Admin Forms State
    const [adminProductId, setAdminProductId] = useState(null);
    const [adminName, setAdminName] = useState('');
    const [adminPrice, setAdminPrice] = useState(0);
    const [adminBrand, setAdminBrand] = useState('');
    const [adminCategory, setAdminCategory] = useState('');
    const [adminStock, setAdminStock] = useState(0);
    const [adminDesc, setAdminDesc] = useState('');
    const [adminImage, setAdminImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);

    // Load Products on startup
    useEffect(() => {
        fetchProducts();
    }, []);

    // Save cart to local storage when updated
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err.message);
        }
    };

    const handleProductClick = async (id) => {
        try {
            const data = await getProductById(id);
            setActiveProduct(data);
            setView('product');
        } catch (err) {
            console.error('Error fetching product detail:', err.message);
        }
    };

    // --- CART ACTIONS ---
    const addToCart = (product, qty) => {
        const existItem = cart.find((x) => x.product === product._id);
        if (existItem) {
            setCart(cart.map((x) => x.product === product._id ? { ...x, qty: Number(qty) } : x));
        } else {
            setCart([...cart, {
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: Number(qty)
            }]);
        }
        setView('cart');
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((x) => x.product !== id));
    };

    const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    // --- AUTH ACTIONS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const data = await login(authEmail, authPassword);
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setView('home');
            setAuthEmail('');
            setAuthPassword('');
        } catch (err) {
            setAuthError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const data = await register(authName, authEmail, authPassword);
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setView('home');
            setAuthName('');
            setAuthEmail('');
            setAuthPassword('');
        } catch (err) {
            setAuthError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleLogout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        setCart([]);
        localStorage.removeItem('cart');
        setView('home');
    };

    // --- PAYMENTS & CHECKOUT ---
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!userInfo) {
            setView('login');
            return;
        }

        if (!address || !city || !postalCode || !country) {
            alert('Please fill in shipping address details!');
            return;
        }

        const resScript = await loadRazorpay();
        if (!resScript) {
            alert('Razorpay SDK failed to load. Are you offline?');
            return;
        }

        try {
            // 1. Create order in our Database
            const orderItemsData = cart.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item.product
            }));

            const createdOrder = await createOrder({
                orderItems: orderItemsData,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'Razorpay',
                totalPrice: cartSubtotal
            });

            // 2. Create Order in Razorpay Server
            const rzpOrder = await createRazorpayOrder(cartSubtotal);

            // 3. Configure Razorpay modal
            const options = {
                key: 'rzp_test_placeholder', // Replaced by backend, or standard placeholder
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: 'Code Alpha E-Commerce',
                description: 'E-commerce Purchase Checkout',
                order_id: rzpOrder.id,
                handler: async function (response) {
                    try {
                        await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: createdOrder._id
                        });
                        alert('Payment Successful! Thank you for ordering.');
                        setCart([]);
                        setView('orders');
                        fetchMyOrders();
                    } catch (verifyErr) {
                        alert('Payment verification failed in backend: ' + verifyErr.message);
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email
                },
                theme: {
                    color: '#6366f1'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            alert('Error during checkout: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSkipCheckout = async () => {
        if (!userInfo) {
            setView('login');
            return;
        }

        if (!address || !city || !postalCode || !country) {
            alert('Please fill in shipping address details!');
            return;
        }

        try {
            // 1. Create order in our Database
            const orderItemsData = cart.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item.product
            }));

            const createdOrder = await createOrder({
                orderItems: orderItemsData,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'Test/Skip Method',
                totalPrice: cartSubtotal
            });

            // 2. Direct payment updates
            await payOrder(createdOrder._id, {
                id: 'skip_pay_' + Date.now(),
                status: 'success',
                update_time: Date.now().toString(),
                email_address: userInfo.email
            });

            alert('Order Placed Successfully via Test Skip Option!');
            setCart([]);
            setView('orders');
            fetchMyOrders();
        } catch (err) {
            alert('Error during skip checkout: ' + (err.response?.data?.message || err.message));
        }
    };

    // --- USER PROFILE & ORDERS ---
    const fetchMyOrders = async () => {
        try {
            const data = await getMyOrders();
            setMyOrders(data);
        } catch (err) {
            console.error('Error fetching user orders:', err.message);
        }
    };

    useEffect(() => {
        if (userInfo) {
            fetchMyOrders();
            if (userInfo.role === 'admin') {
                fetchAdminOrders();
            }
        }
    }, [userInfo]);

    // --- ADMIN MODULE ACTIONS ---
    const fetchAdminOrders = async () => {
        try {
            const data = await getOrders();
            setAllOrders(data);
        } catch (err) {
            console.error('Error fetching all orders:', err.message);
        }
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const res = await uploadImage(formData);
            setAdminImage(res.url);
            setUploading(false);
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.message || err.message));
            setUploading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: adminName,
            price: Number(adminPrice),
            brand: adminBrand,
            category: adminCategory,
            countInStock: Number(adminStock),
            description: adminDesc,
            image: adminImage || 'https://via.placeholder.com/150'
        };

        try {
            if (adminProductId) {
                await updateProduct(adminProductId, productData);
                alert('Product updated successfully!');
            } else {
                await createProduct(productData);
                alert('Product created successfully!');
            }
            fetchProducts();
            closeAdminModal();
        } catch (err) {
            alert('Operation failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const openCreateModal = () => {
        setAdminProductId(null);
        setAdminName('');
        setAdminPrice(0);
        setAdminBrand('');
        setAdminCategory('');
        setAdminStock(0);
        setAdminDesc('');
        setAdminImage('');
        setShowAdminModal(true);
    };

    const openEditModal = (product) => {
        setAdminProductId(product._id);
        setAdminName(product.name);
        setAdminPrice(product.price);
        setAdminBrand(product.brand);
        setAdminCategory(product.category);
        setAdminStock(product.countInStock);
        setAdminDesc(product.description);
        setAdminImage(product.image);
        setShowAdminModal(true);
    };

    const closeAdminModal = () => {
        setShowAdminModal(false);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                alert('Product deleted');
                fetchProducts();
            } catch (err) {
                alert('Deletion failed');
            }
        }
    };

    const handleDeliverOrder = async (id) => {
        try {
            await deliverOrder(id);
            alert('Order delivered status updated');
            fetchAdminOrders();
        } catch (err) {
            alert('Delivery update failed');
        }
    };

    return (
        <div className="animate-fade">
            {/* Header Navigation Component */}
            <Navbar
                view={view}
                setView={setView}
                cart={cart}
                userInfo={userInfo}
                handleLogout={handleLogout}
                fetchMyOrders={fetchMyOrders}
                fetchAdminOrders={fetchAdminOrders}
            />

            <main className="container" style={{ paddingBottom: '60px' }}>
                {/* 1. HOME VIEW */}
                {view === 'home' && (
                    <div>
                        <div className="home-hero">
                            <h1 className="hero-title">Discover Premium Products</h1>
                            <p className="hero-subtitle">Experience shopping built with cutting-edge stack integrations and frosted glass interfaces.</p>
                        </div>
                        <h2 className="section-title">All Products</h2>
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    handleProductClick={handleProductClick}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. PRODUCT DETAILS VIEW */}
                {view === 'product' && activeProduct && (
                    <ProductDetails
                        product={activeProduct}
                        setView={setView}
                        addToCart={addToCart}
                    />
                )}

                {/* 3. CART VIEW */}
                {view === 'cart' && (
                    <CartView
                        cart={cart}
                        setView={setView}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        cartSubtotal={cartSubtotal}
                        address={address}
                        setAddress={setAddress}
                        city={city}
                        setCity={setCity}
                        postalCode={postalCode}
                        setPostalCode={setPostalCode}
                        country={country}
                        setCountry={setCountry}
                        handleCheckout={handleCheckout}
                        handleSkipCheckout={handleSkipCheckout}
                    />
                )}

                {/* 4. AUTH VIEWS */}
                {(view === 'login' || view === 'register') && (
                    <AuthView
                        view={view}
                        setView={setView}
                        authEmail={authEmail}
                        setAuthEmail={setAuthEmail}
                        authPassword={authPassword}
                        setAuthPassword={setAuthPassword}
                        authName={authName}
                        setAuthName={setAuthName}
                        authError={authError}
                        setAuthError={setAuthError}
                        handleLogin={handleLogin}
                        handleRegister={handleRegister}
                    />
                )}

                {/* 5. USER ORDERS VIEW */}
                {view === 'orders' && (
                    <OrdersView myOrders={myOrders} />
                )}

                {/* 6. ADMIN VIEW */}
                {view === 'admin' && (
                    <AdminDashboard
                        products={products}
                        allOrders={allOrders}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteProduct={handleDeleteProduct}
                        handleDeliverOrder={handleDeliverOrder}
                        showAdminModal={showAdminModal}
                        closeAdminModal={closeAdminModal}
                        handleProductSubmit={handleProductSubmit}
                        adminProductId={adminProductId}
                        adminName={adminName}
                        setAdminName={setAdminName}
                        adminPrice={adminPrice}
                        setAdminPrice={setAdminPrice}
                        adminStock={adminStock}
                        setAdminStock={setAdminStock}
                        adminBrand={adminBrand}
                        setAdminBrand={setAdminBrand}
                        adminCategory={adminCategory}
                        setAdminCategory={setAdminCategory}
                        adminDesc={adminDesc}
                        setAdminDesc={setAdminDesc}
                        adminImage={adminImage}
                        handleUploadImage={handleUploadImage}
                        uploading={uploading}
                    />
                )}
            </main>

            <footer className="footer">
                <div className="container">
                    <p>© 2026 CodeAlpha E-Commerce Website. Built for Pair Programming Project.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
