import React from 'react';

function Navbar({ view, setView, cart, userInfo, handleLogout, fetchMyOrders, fetchAdminOrders }) {
    return (
        <nav className="navbar">
            <div className="container">
                <a href="#" className="nav-logo" onClick={() => setView('home')}>
                    ⚡ CodeAlpha Store
                </a>
                <ul className="nav-links">
                    <li>
                        <a href="#" className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className={`nav-link cart-icon-container ${view === 'cart' ? 'active' : ''}`} onClick={() => setView('cart')}>
                            Cart
                            {cart.length > 0 && <span className="cart-badge">{cart.reduce((a, c) => a + c.qty, 0)}</span>}
                        </a>
                    </li>
                    {userInfo ? (
                        <>
                            <li>
                                <a href="#" className={`nav-link ${view === 'orders' ? 'active' : ''}`} onClick={() => { setView('orders'); fetchMyOrders(); }}>
                                    My Orders
                                </a>
                            </li>
                            {userInfo.role === 'admin' && (
                                <li>
                                    <a href="#" className={`nav-link ${view === 'admin' ? 'active' : ''}`} onClick={() => { setView('admin'); fetchAdminOrders(); }}>
                                        Admin
                                    </a>
                                </li>
                            )}
                            <li><span className="nav-link" style={{ color: 'white' }}>Hi, {userInfo.name}</span></li>
                            <li><button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <li><a href="#" className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setView('login')}>Login</a></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
