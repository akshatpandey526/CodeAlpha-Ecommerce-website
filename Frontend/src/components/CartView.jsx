import React from 'react';

function CartView({
    cart,
    setView,
    addToCart,
    removeFromCart,
    cartSubtotal,
    address,
    setAddress,
    city,
    setCity,
    postalCode,
    setPostalCode,
    country,
    setCountry,
    handleCheckout,
    handleSkipCheckout
}) {
    return (
        <div className="animate-fade">
            <h2 className="section-title">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your cart is empty.</p>
                    <button className="btn btn-primary" onClick={() => setView('home')}>Shop Now</button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-list">
                        {cart.map((item) => (
                            <div key={item.product} className="cart-item glass-panel">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div>
                                    <h4 style={{ fontWeight: 600 }}>{item.name}</h4>
                                </div>
                                <div style={{ fontWeight: 700 }}>₹{item.price}</div>
                                <div>
                                    <select
                                        value={item.qty}
                                        className="qty-select"
                                        onChange={(e) => addToCart({ _id: item.product, name: item.name, image: item.image, price: item.price, countInStock: item.countInStock }, e.target.value)}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => removeFromCart(item.product)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="summary-panel glass-panel">
                        <h3>Order Summary</h3>
                        <hr style={{ borderColor: 'var(--panel-border)' }} />
                        <div className="summary-row">
                            <span>Total Items:</span>
                            <span>{cart.reduce((a, c) => a + c.qty, 0)}</span>
                        </div>
                        <div className="summary-row" style={{ fontWeight: 700 }}>
                            <span>Total Price:</span>
                            <span>₹{cartSubtotal}</span>
                        </div>
                        <hr style={{ borderColor: 'var(--panel-border)' }} />
                        <h4>Shipping Address</h4>
                        <div className="form-group">
                            <input type="text" placeholder="Address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <input type="text" placeholder="City" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
                            <input type="text" placeholder="Postal Code" className="form-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                            <input type="text" placeholder="Country" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                            Pay with Razorpay
                        </button>
                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={handleSkipCheckout}>
                            Test Order / Skip Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartView;
