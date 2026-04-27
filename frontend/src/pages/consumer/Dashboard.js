import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const STATUS_BADGE = {
  pending:          'bg-yellow-100 text-yellow-800',
  accepted:         'bg-blue-100 text-blue-800',
  preparing:        'bg-purple-100 text-purple-800',
  ready:            'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-800',
};

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch { toast.error('Failed to load orders'); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const totalSpent   = orders.filter(o => o.status?.current !== 'cancelled').reduce((s, o) => s + (o.pricing?.total || 0), 0);
  const activeOrders = orders.filter(o => !['delivered','cancelled'].includes(o.status?.current)).length;

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-stone-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 text-sm mt-1">Here's your order summary</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Orders',  value: orders.length,                    color: 'text-stone-800',  bg: 'bg-white',           icon: '📦' },
            { label: 'Active Orders', value: activeOrders,                     color: 'text-orange-600', bg: 'bg-orange-50',       icon: '🚚' },
            { label: 'Total Spent',   value: `₹${totalSpent.toFixed(0)}`,      color: 'text-green-700',  bg: 'bg-green-50',        icon: '💰' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-stone-100 p-5 shadow-sm`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Shop Now',    href: '/products',  icon: '🛒', color: 'bg-amber-700 text-white' },
            { label: 'My Orders',   href: '/my-orders', icon: '📋', color: 'bg-white text-stone-800 border border-stone-200' },
            { label: 'Wishlist',    href: '/wishlist',  icon: '❤️', color: 'bg-white text-stone-800 border border-stone-200' },
            { label: 'Cart',        href: '/cart',      icon: '🛍️', color: 'bg-white text-stone-800 border border-stone-200' },
          ].map(a => (
            <Link key={a.label} to={a.href}
              className={`${a.color} rounded-xl p-4 text-center font-semibold text-sm hover:shadow-md transition-all`}>
              <div className="text-2xl mb-1">{a.icon}</div>
              {a.label}
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-bold text-stone-900">Recent Orders</h2>
            <Link to="/my-orders" className="text-xs text-amber-700 font-semibold hover:underline">View all →</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-stone-500 text-sm mb-4">No orders yet</p>
              <Link to="/products" className="bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-800 transition-all">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl shrink-0">📦</div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">#{order.orderNumber}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[order.status?.current] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status?.current?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-bold text-stone-900">₹{order.pricing?.total?.toFixed(0)}</span>
                    <Link to={`/orders/${order._id}`}
                      className="text-xs text-amber-700 font-semibold hover:underline shrink-0">
                      Track →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
