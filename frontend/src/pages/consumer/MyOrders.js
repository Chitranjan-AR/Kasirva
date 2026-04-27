import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = filter !== 'all' ? `?status=${filter}` : '';
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/orders${query}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Orders fetch error:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filter]);

  const getStatusColor = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Order Placed',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs — using actual Order model status values */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm w-max">
            {[
              { key: 'all',              label: 'All Orders' },
              { key: 'pending',          label: 'Order Placed' },
              { key: 'accepted',         label: 'Accepted' },
              { key: 'preparing',        label: 'Preparing' },
              { key: 'out_for_delivery', label: 'Out for Delivery' },
              { key: 'delivered',        label: 'Delivered' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No orders with status "${filter}".`}
            </p>
            <Link to="/products" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status?.current)}`}>
                      {getStatusText(order.status?.current)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/60x60/22c55e/ffffff?text=🥛'}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/60x60/22c55e/ffffff?text=🥛'}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                      {order.farmer && (
                        <div className="text-sm text-gray-500">Farmer: {order.farmer.farmName}</div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold text-lg">₹{order.pricing?.total?.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </div>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
