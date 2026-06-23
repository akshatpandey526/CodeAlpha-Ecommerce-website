import React from 'react';

function AdminDashboard({
    products,
    allOrders,
    openCreateModal,
    openEditModal,
    handleDeleteProduct,
    handleDeliverOrder,
    showAdminModal,
    closeAdminModal,
    handleProductSubmit,
    adminProductId,
    adminName,
    setAdminName,
    adminPrice,
    setAdminPrice,
    adminStock,
    setAdminStock,
    adminBrand,
    setAdminBrand,
    adminCategory,
    setAdminCategory,
    adminDesc,
    setAdminDesc,
    adminImage,
    handleUploadImage,
    uploading
}) {
    return (
        <div className="animate-fade">
            <div className="admin-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Admin Dashboard</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>Add Product</button>
            </div>

            <h3>Product Management</h3>
            <table className="admin-table glass-panel">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td><img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                            <td>{product.name}</td>
                            <td>₹{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.countInStock}</td>
                            <td>
                                <button className="btn btn-secondary" style={{ padding: '6px 12px', marginRight: '8px' }} onClick={() => openEditModal(product)}>Edit</button>
                                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Order Deliveries</h3>
            {allOrders.length === 0 ? (
                <p>No customer orders placed yet.</p>
            ) : (
                allOrders.map((order) => (
                    <div key={order._id} className="order-card glass-panel">
                        <div className="order-meta">
                            <span>Order ID: {order._id}</span>
                            <span>User: {order.user?.name || order.user}</span>
                        </div>
                        <div>Total Price: ₹{order.totalPrice}</div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                            <span>Payment: {order.isPaid ? <span className="status-badge status-instock">Paid</span> : <span className="status-badge status-outofstock">Unpaid</span>}</span>
                            <span>Delivery: {order.isDelivered ? <span className="status-badge status-instock">Delivered</span> : <span className="status-badge status-outofstock">Pending</span>}</span>
                        </div>
                        {order.isPaid && !order.isDelivered && (
                            <button className="btn btn-primary" style={{ width: 'fit-content', padding: '8px 16px', marginTop: '10px' }} onClick={() => handleDeliverOrder(order._id)}>
                                Mark as Delivered
                            </button>
                        )}
                    </div>
                ))
            )}

            {/* Admin Add/Edit Product Modal */}
            {showAdminModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel-glow">
                        <h3 className="modal-title">{adminProductId ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleProductSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input type="text" required className="form-input" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input type="number" required className="form-input" value={adminPrice} onChange={(e) => setAdminPrice(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Count In Stock</label>
                                    <input type="number" required className="form-input" value={adminStock} onChange={(e) => setAdminStock(e.target.value)} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Brand</label>
                                    <input type="text" required className="form-input" value={adminBrand} onChange={(e) => setAdminBrand(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input type="text" required className="form-input" value={adminCategory} onChange={(e) => setAdminCategory(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea rows="3" required className="form-input" value={adminDesc} onChange={(e) => setAdminDesc(e.target.value)} style={{ resize: 'none' }}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Upload Product Image</label>
                                <input type="file" className="form-input" onChange={handleUploadImage} />
                                {uploading && <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Uploading to Cloudinary...</div>}
                                {adminImage && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={adminImage} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={closeAdminModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {adminProductId ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
