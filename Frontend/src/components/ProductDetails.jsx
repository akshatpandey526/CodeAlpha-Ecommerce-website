import React from 'react';

function ProductDetails({ product, setView, addToCart }) {
    const handleAddToCart = () => {
        const qtySelect = document.getElementById('detail-qty-select');
        const qty = qtySelect ? qtySelect.value : 1;
        addToCart(product, qty);
    };

    return (
        <div className="detail-grid animate-fade">
            <div className="detail-image-container">
                <img src={product.image} alt={product.name} className="detail-image" />
            </div>
            <div className="detail-info">
                <span className="detail-brand">{product.brand}</span>
                <h1 className="detail-name">{product.name}</h1>
                <div className="detail-price">₹{product.price}</div>
                <p className="detail-desc">{activeProductDesc()}</p>
                <div>
                    <span className={`status-badge ${product.countInStock > 0 ? 'status-instock' : 'status-outofstock'}`}>
                        {product.countInStock > 0 ? `In Stock (${product.countInStock} left)` : 'Out of Stock'}
                    </span>
                </div>
                {product.countInStock > 0 && (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span className="form-label">Qty:</span>
                        <select id="detail-qty-select" className="qty-select">
                            {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>
                )}
                <button className="btn btn-secondary" onClick={() => setView('home')}>Back to Home</button>
            </div>
        </div>
    );

    function activeProductDesc() {
        return product.description || '';
    }
}

export default ProductDetails;
