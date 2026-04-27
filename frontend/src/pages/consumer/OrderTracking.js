import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const token = () => localStorage.getItem('token');

const STATUS_STEPS = [
  { key: 'pending',          label: 'Order Placed',       icon: '📋', desc: 'We have received your order'              },
  { key: 'accepted',         label: 'Order Confirmed',    icon: '✅', desc: 'Farmer confirmed your order'              },
  { key: 'preparing',        label: 'Being Prepared',     icon: '🧑‍🍳', desc: 'Your fresh products are being prepared'  },
  { key: 'ready',            label: 'Ready to Ship',      icon: '📦', desc: 'Packed and ready for pickup'              },
  { key: 'out_for_delivery', label: 'Out for Delivery',   icon: '🚚', desc: 'On the way to your address'               },
  { key: 'delivered',        label: 'Delivered',          icon: '🎉', desc: 'Delivered successfully'                   },
];

const STATUS_COLOR = {
  pending:          { bg: 'bg-yellow-50',  border: 'border-yellow-300', text: 'text-yellow-800',  badge: 'bg-yellow-100 text-yellow-800'  },
  accepted:         { bg: 'bg-blue-50',    border: 'border-blue-300',   text: 'text-blue-800',    badge: 'bg-blue-100 text-blue-800'      },
  preparing:        { bg: 'bg-purple-50',  border: 'border-purple-300', text: 'text-purple-800',  badge: 'bg-purple-100 text-purple-800'  },
  ready:            { bg: 'bg-indigo-50',  border: 'border-indigo-300', text: 'text-indigo-800',  badge: 'bg-indigo-100 text-indigo-800'  },
  out_for_delivery: { bg: 'bg-orange-50',  border: 'border-orange-300', text: 'text-orange-800',  badge: 'bg-orange-100 text-orange-800'  },
  delivered:        { bg: 'bg-green-50',   border: 'border-green-300',  text: 'text-green-800',   badge: 'bg-green-100 text-green-800'    },
  cancelled:        { bg: 'bg-red-50',     border: 'border-red-300',    text: 'text-red-800',     badge: 'bg-red-100 text-red-800'        },
  rejected:         { bg: 'bg-red-50',     border: 'border-red-300',    text: 'text-red-800',     badge: 'bg-red-100 text-red-800'        },
};

const fmt = (n) => Number(n || 0).toFixed(2);

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview]         = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error();
      setOrder(await res.json());
    } catch {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Auto-refresh every 30s if order is active
  useEffect(() => {
    if (!order) return;
    const active = ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery'];
    if (!active.includes(order.status?.current)) return;
    const t = setInterval(fetchOrder, 30000);
    return () => clearInterval(t);
  }, [order, fetchOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API}/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ reason: 'Cancelled by customer' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch {
      toast.error('Failed to cancel order. Please contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/orders/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error();
      toast.success('Review submitted! Thank you 🙏');
      setShowReview(false);
      fetchOrder();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading order details...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
        <Link to="/my-orders" className="text-green-600 hover:underline text-sm">← Back to My Orders</Link>
      </div>
    </div>
  );

  const currentStatus  = order.status?.current;
  const currentIdx     = STATUS_STEPS.findIndex(s => s.key === currentStatus);
  const isCancelled    = currentStatus === 'cancelled' || currentStatus === 'rejected';
  const isDelivered    = currentStatus === 'delivered';
  const canCancel      = ['pending', 'accepted'].includes(currentStatus);
  const colors         = STATUS_COLOR[currentStatus] || STATUS_COLOR.pending;
  const currentStep    = STATUS_STEPS[currentIdx];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link to="/my-orders" className="hover:text-green-700">My Orders</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">#{order.orderNumber}</span>
        </div>

        {/* ── Order Header Card ── */}
        <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{isCancelled ? '❌' : currentStep?.icon || '📋'}</span>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900">
                  {isCancelled ? 'Order Cancelled' : currentStep?.label || currentStatus}
                </h1>
                <p className={`text-sm font-medium ${colors.text}`}>{currentStep?.desc}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Order #{order.orderNumber} &nbsp;·&nbsp;
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${colors.badge}`}>
              {currentStatus?.replace(/_/g, ' ')}
            </span>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-1.5 rounded-full border-2 border-red-400 text-red-600 text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* ── Progress Stepper (Flipkart style) ── */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Order Progress</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }}>
                <div
                  className="h-1 bg-green-500 rounded-full transition-all duration-700"
                  style={{ width: currentIdx >= 0 ? `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
                />
              </div>

              <div className="relative flex justify-between" style={{ zIndex: 1 }}>
                {STATUS_STEPS.map((step, idx) => {
                  const done   = idx < currentIdx;
                  const active = idx === currentIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        done    ? 'bg-green-500 border-green-500 text-white shadow-md' :
                        active  ? 'bg-white border-green-500 text-green-600 shadow-lg ring-4 ring-green-100' :
                                  'bg-white border-gray-200 text-gray-300'
                      }`}>
                        {done ? '✓' : step.icon}
                      </div>
                      <p className={`text-xs font-semibold mt-2 text-center leading-tight ${
                        done || active ? 'text-gray-800' : 'text-gray-400'
                      }`} style={{ maxWidth: 70 }}>
                        {step.label}
                      </p>
                      {active && (
                        <span className="text-xs text-green-600 font-bold mt-0.5">Now</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Status History Timeline ── */}
        {order.status?.history?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Activity Timeline</h2>
            <div className="space-y-0">
              {[...order.status.history].reverse().map((h, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${i === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {i < order.status.history.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold capitalize ${i === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {h.status?.replace(/_/g, ' ')}
                    </p>
                    {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(h.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Order Items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">
            Order Items ({order.items?.length})
          </h2>
          <div className="divide-y divide-gray-50">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <img
                  src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop'}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop'}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{item.product?.name || 'Product'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{fmt(item.price)} × {item.quantity} {item.unit}
                  </p>
                </div>
                <p className="font-bold text-gray-900 text-sm shrink-0">₹{fmt(item.totalPrice)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Delivery + Farmer + Payment ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">📍 Delivery Address</h3>
            <p className="text-sm font-semibold text-gray-900">{order.delivery?.address?.street}</p>
            <p className="text-sm text-gray-600">{order.delivery?.address?.city}, {order.delivery?.address?.state}</p>
            <p className="text-sm text-gray-600">{order.delivery?.address?.pincode}</p>
            {order.delivery?.slot?.date && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Delivery Slot</p>
                <p className="text-sm font-medium text-gray-800">
                  📅 {new Date(order.delivery.slot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  &nbsp;·&nbsp; 🕐 {order.delivery.slot.timeSlot}
                </p>
              </div>
            )}
          </div>

          {/* Farmer Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">👨‍🌾 Sold By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl shrink-0">👨‍🌾</div>
              <div>
                <p className="text-sm font-bold text-gray-900">{order.farmer?.farmName || 'Local Farm'}</p>
                <p className="text-xs text-green-600 font-medium">✅ Verified Farmer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400 text-xs">★★★★★</span>
                  <span className="text-xs text-gray-400">{order.farmer?.rating?.average?.toFixed(1) || '4.5'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">💳 Payment</h3>
            <p className="text-sm font-semibold text-gray-900">
              {order.payment?.method === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
            </p>
            <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              order.payment?.status === 'completed' ? 'bg-green-100 text-green-700' :
              order.payment?.status === 'failed'    ? 'bg-red-100 text-red-700' :
                                                      'bg-yellow-100 text-yellow-700'
            }`}>
              {order.payment?.status?.toUpperCase() || 'PENDING'}
            </span>
            {order.payment?.transactionId && (
              <p className="text-xs text-gray-400 mt-2 break-all">TXN: {order.payment.transactionId}</p>
            )}
          </div>
        </div>

        {/* ── Price Breakdown (Invoice style) ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">🧾 Price Details</h2>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price ({order.items?.length} items)</span>
              <span className="text-gray-900">₹{fmt(order.pricing?.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className={order.pricing?.deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                {order.pricing?.deliveryFee === 0 ? 'FREE' : `₹${fmt(order.pricing?.deliveryFee)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (5%)</span>
              <span className="text-gray-900">₹{fmt(order.pricing?.tax)}</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-₹{fmt(order.pricing?.discount)}</span>
              </div>
            )}
            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900 text-base">Total Amount</span>
              <span className="font-extrabold text-green-700 text-lg">₹{fmt(order.pricing?.total)}</span>
            </div>
          </div>
          {order.pricing?.deliveryFee === 0 && (
            <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-3">
              🎉 You saved on delivery charges!
            </p>
          )}
        </div>

        {/* ── Review Section ── */}
        {isDelivered && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            {order.review?.rating ? (
              <div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">⭐ Your Review</h2>
                <div className="flex items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-xl ${s <= order.review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{order.review.rating}/5</span>
                </div>
                {order.review.comment && <p className="text-sm text-gray-700 italic">"{order.review.comment}"</p>}
              </div>
            ) : showReview ? (
              <div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">⭐ Rate Your Order</h2>
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      onClick={() => setReview(r => ({ ...r, rating: s }))}
                      className={`text-3xl transition-transform hover:scale-110 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    >★</button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{review.rating}/5</span>
                </div>
                <textarea
                  value={review.comment}
                  onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                  placeholder="Share your experience with this order... (optional)"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-400 resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => setShowReview(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">How was your order?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your feedback helps other customers</p>
                </div>
                <button
                  onClick={() => setShowReview(true)}
                  className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-all"
                >
                  ⭐ Rate Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Help & Support ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">🆘 Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📞', title: 'Call Support',  sub: '1800-XXX-XXXX',       color: 'bg-green-50 border-green-100'  },
              { icon: '💬', title: 'Live Chat',     sub: 'Available 24/7',      color: 'bg-blue-50 border-blue-100'    },
              { icon: '📧', title: 'Email Us',      sub: 'support@kshirva.com', color: 'bg-purple-50 border-purple-100'},
            ].map(h => (
              <div key={h.title} className={`flex items-center gap-3 p-4 rounded-xl border ${h.color}`}>
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{h.title}</p>
                  <p className="text-xs text-gray-500">{h.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Actions ── */}
        <div className="flex flex-wrap gap-3 justify-between">
          <Link
            to="/my-orders"
            className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:underline"
          >
            ← Back to My Orders
          </Link>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-xl border-2 border-green-600 text-green-700 text-sm font-bold hover:bg-green-50 transition-all"
            >
              Continue Shopping
            </Link>
            {isDelivered && (
              <button
                onClick={() => {
                  // Re-order: add all items to cart
                  toast.success('Items added to cart for reorder!');
                  navigate('/cart');
                }}
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all"
              >
                🔄 Reorder
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
