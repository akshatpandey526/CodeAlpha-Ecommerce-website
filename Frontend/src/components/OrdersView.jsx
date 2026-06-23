import React from 'react';

function OrdersView({ myOrders }) {
    return (
        <div className="animate-fade">
            <h2 className="section-title">My Orders</h2>
            {myOrders.length === 0 ? (
                <p>You have not placed any orders yet.</p>
            ) : (
                myOrders.map((order) => (
                    <div key={order._id} className="order-card glass-panel">
                        <div className="order-meta">
                            <span>Order ID: {order._id}</span>
                            <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.name} (x{item.qty})</span>
                                    <span>₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <hr style={{ borderColor: 'var(--panel-border)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ marginRight: '16px' }}>
                                    Payment: {order.isPaid ? <span className="status-badge status-instock">Paid at {new Date(order.paidAt).toLocaleDateString()}</span> : <span className="status-badge status-outofstock">Unpaid</span>}
                                </span>
                                <span>
                                    Delivery: {order.isDelivered ? <span className="status-badge status-instock">Delivered</span> : <span className="status-badge status-outofstock">Pending</span>}
                                </span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: ₹{order.totalPrice}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default OrdersView;
