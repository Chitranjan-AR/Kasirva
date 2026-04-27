import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const STEPS = [
  { id: 1, label: 'Cart Review',       icon: '🛒' },
  { id: 2, label: 'Delivery Address',  icon: '📍' },
  { id: 3, label: 'Payment',           icon: '💳' },
  { id: 4, label: 'Confirm Order',     icon: '✅' },
];

const TIME_SLOTS = [
  '6:00 AM - 9:00 AM',
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
];

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street:  user?.address?.street  || '',
    city:    user?.address?.city    || '',
    state:   user?.address?.state   || '',
    pincode: user?.address?.pincode || '',
  });

  const [slot, setSlot] = useState({
    date:     '',
    timeSlot: TIME_SLOTS[1],
  });

  const [payMethod, setPayMethod] = useState('cod');

  const razorpayAvailable = !!window.Razorpay && !!process.env.REACT_APP_RAZORPAY_KEY_ID;

  const subtotal    = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax         = subtotal * 0.05;
  const total       = subtotal + deliveryFee + tax;

  const fmt = (n) => Number(n).toFixed(2);

  // ── Validation ──
  const validateStep = () => {
    if (step === 1) {
      if (cartItems.length === 0) { toast.error('Your cart is empty'); return false; }
      return true;
    }
    if (step === 2) {
      if (!address.street.trim()) { toast.error('Please enter street address'); return false; }
      if (!address.city.trim())   { toast.error('Please enter city'); return false; }
      if (!address.state.trim())  { toast.error('Please enter state'); return false; }
      if (!/^\d{6}$/.test(address.pincode)) { toast.error('Please enter valid 6-digit pincode'); return false; }
      if (!slot.date)             { toast.error('Please select delivery date'); return false; }
      return true;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  // ── Place Order ──
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map(i => ({ productId: i.product._id, quantity: i.quantity })),
        delivery: { address, slot, method: 'farmer_delivery' },
        payment:  { method: payMethod },
      };

      const res  = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) { toast.error(data.message || 'Failed to place order'); return; }

      if (payMethod === 'online') {
        await handleOnlinePayment(data.order._id, total);
      } else {
        toast.success('🎉 Order placed successfully!');
        clearCart();
        navigate(`/orders/${data.order._id}`);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async (orderId, amount) => {
    if (!window.Razorpay) {
      toast.error('Online payment unavailable. Order placed as COD.');
      clearCart();
      navigate(`/orders/${orderId}`);
      return;
    }
    try {
      const res = await fetch(`${API}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ amount, orderId }),
      });
      const pd = await res.json();
      if (!res.ok) {
        toast.error(pd.message || 'Payment failed. Order saved as COD.');
        clearCart();
        navigate(`/orders/${orderId}`);
        return;
      }

      const rzp = new window.Razorpay({
        key: pd.key, amount: pd.amount, currency: pd.currency, order_id: pd.orderId,
        name: 'Kshirva', description: 'Fresh Dairy Delivery',
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#16a34a' },
        handler: async (response) => {
          await fetch(`${API}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ ...response, orderId }),
          });
          toast.success('Payment successful! 🎉');
          clearCart();
          navigate(`/orders/${orderId}`);
        },
        modal: { ondismiss: () => { toast.error('Payment cancelled'); navigate(`/orders/${orderId}`); } },
      });
      rzp.open();
    } catch (e) {
      toast.error('Payment failed. Please contact support.');
      navigate(`/orders/${orderId}`);
    }
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Link to="/products" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Stepper ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                    step > s.id  ? 'bg-green-500 border-green-500 text-white' :
                    step === s.id ? 'bg-white border-green-500 text-green-600 ring-4 ring-green-100' :
                                    'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {step > s.id ? '✓' : s.icon}
                  </div>
                  <p className={`text-xs font-semibold mt-1.5 hidden sm:block ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1 — Cart Review */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Review Your Items</h2>
                <div className="divide-y divide-gray-50">
                  {cartItems.map(item => (
                    <div key={item.product._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <img
                        src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">₹{item.product.price.amount}/{item.product.price.unit}</p>
                        {item.product.farmingDetails?.isOrganic && (
                          <span className="text-xs text-green-600 font-medium">🌿 Organic</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">₹{fmt(item.product.price.amount * item.quantity)}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <Link to="/cart" className="text-sm text-green-700 font-semibold hover:underline">← Edit Cart</Link>
                  <button onClick={next} className="bg-green-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Delivery Address */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">📍 Delivery Address</h2>
                  <div className="space-y-3">
                    <input
                      type="text" placeholder="Street Address *"
                      value={address.street}
                      onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text" placeholder="City *"
                        value={address.city}
                        onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      />
                      <input
                        type="text" placeholder="State *"
                        value={address.state}
                        onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                    <input
                      type="text" placeholder="Pincode * (6 digits)"
                      value={address.pincode} maxLength={6}
                      onChange={e => setAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g, '') }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">🕐 Delivery Slot</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Date *</label>
                      <input
                        type="date"
                        value={slot.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setSlot(s => ({ ...s, date: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Time Slot</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_SLOTS.map(t => (
                          <button
                            key={t}
                            onClick={() => setSlot(s => ({ ...s, timeSlot: t }))}
                            className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                              slot.timeSlot === t
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={prev} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all">
                    ← Back
                  </button>
                  <button onClick={next} className="bg-green-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">💳 Payment Method</h2>
                <div className="space-y-3">
                  {[
                    {
                      value: 'cod',
                      title: '💵 Cash on Delivery',
                      sub: 'Pay when your order arrives',
                      badge: '✓ No advance payment',
                      badgeColor: 'text-green-600',
                    },
                    ...( razorpayAvailable ? [{
                      value: 'online',
                      title: '💳 Pay Online',
                      sub: 'UPI, Debit/Credit Card, Net Banking, Wallets',
                      badge: '🔒 256-bit SSL secured',
                      badgeColor: 'text-blue-600',
                    }] : []),
                  ].map(opt => (
                    <label
                      key={opt.value}
                      onClick={() => setPayMethod(opt.value)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        payMethod === opt.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        payMethod === opt.value ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {payMethod === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{opt.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                        <p className={`text-xs font-semibold mt-1 ${opt.badgeColor}`}>{opt.badge}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={prev} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all">
                    ← Back
                  </button>
                  <button onClick={next} className="bg-green-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                {/* Address summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-700">📍 Delivering to</h3>
                    <button onClick={() => setStep(2)} className="text-xs text-green-600 font-semibold hover:underline">Change</button>
                  </div>
                  <p className="text-sm text-gray-800">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {slot.date ? new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} &nbsp;·&nbsp; 🕐 {slot.timeSlot}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-700">💳 Payment</h3>
                    <button onClick={() => setStep(3)} className="text-xs text-green-600 font-semibold hover:underline">Change</button>
                  </div>
                  <p className="text-sm text-gray-800">{payMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
                </div>

                {/* Place order */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-extrabold text-green-700">₹{fmt(total)}</p>
                      {deliveryFee === 0 && <p className="text-xs text-green-600 font-medium">🎉 Free delivery applied!</p>}
                    </div>
                    <div className="text-right text-xs text-gray-400 space-y-0.5">
                      <p>Subtotal: ₹{fmt(subtotal)}</p>
                      <p>Delivery: {deliveryFee === 0 ? 'FREE' : `₹${fmt(deliveryFee)}`}</p>
                      <p>GST: ₹{fmt(tax)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3.5 rounded-xl font-extrabold text-base hover:bg-green-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {loading ? '⏳ Placing Order...' : `🎉 Place Order — ₹${fmt(total)}`}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    By placing order you agree to our Terms & Conditions
                  </p>
                </div>

                <button onClick={prev} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                  ← Back to Payment
                </button>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Price Details</h3>

              <div className="space-y-2 mb-4">
                {cartItems.slice(0, 4).map(item => (
                  <div key={item.product._id} className="flex items-center gap-2">
                    <img
                      src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=40&h=40&fit=crop'}
                      alt={item.product.name}
                      className="w-9 h-9 object-cover rounded-lg shrink-0"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=40&h=40&fit=crop'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 shrink-0">₹{fmt(item.product.price.amount * item.quantity)}</p>
                  </div>
                ))}
                {cartItems.length > 4 && (
                  <p className="text-xs text-gray-400 text-center">+{cartItems.length - 4} more items</p>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price ({cartItems.length} items)</span>
                  <span>₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${fmt(deliveryFee)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (5%)</span>
                  <span>₹{fmt(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-base">
                  <span>Total</span>
                  <span className="text-green-700">₹{fmt(total)}</span>
                </div>
              </div>

              {deliveryFee === 0 ? (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-3 font-medium">
                  🎉 You're saving ₹50 on delivery!
                </p>
              ) : (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mt-3">
                  Add ₹{fmt(500 - subtotal)} more for FREE delivery
                </p>
              )}

              <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                <p>🔒 Safe & Secure Payments</p>
                <p>🚚 Easy Returns & Refunds</p>
                <p>✅ 100% Genuine Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
