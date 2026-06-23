import React from 'react';

function ProductCard({ product, handleProductClick }) {
    return (
        <div className="product-card glass-panel-glow" onClick={() => handleProductClick(product._id)}>
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <span className="product-name">{product.name}</span>
                <div className="product-price-row">
                    <span className="product-price">₹{product.price}</span>
                    <span className={`status-badge ${product.countInStock > 0 ? 'status-instock' : 'status-outofstock'}`}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
