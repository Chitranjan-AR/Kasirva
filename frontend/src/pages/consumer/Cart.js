import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal    = getCartTotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const tax         = subtotal * 0.05;
  const total       = subtotal + deliveryFee + tax;
  const freeAt      = 500;
  const progress    = Math.min((subtotal / freeAt) * 100, 100);
  const fmt         = (n) => Number(n).toFixed(2);

  const handleCheckout = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate('/checkout');
  };

  /* ── Empty Cart ── */
  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
        <Link to="/products"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg">
          🥛 Shop Fresh Dairy
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
          </div>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
            🗑 Clear Cart
          </button>
        </div>

        {/* ── Free Delivery Progress ── */}
        {deliveryFee > 0 && (
          <div className="bg-white rounded-2xl border border-green-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Add <span className="text-green-600 font-bold">₹{fmt(freeAt - subtotal)}</span> more for FREE delivery!
              </p>
              <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {deliveryFee === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-4 text-center">
            <p className="text-green-700 font-bold text-sm">🎉 Yay! You get FREE delivery on this order!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => {
              const imgSrc = item.product.images?.[0]?.url || FALLBACK;
              const itemTotal = item.product.price.amount * item.quantity;
              const maxQty = item.product.stock?.quantity || 99;

              return (
                <div key={item.product._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">

                  {/* Image */}
                  <Link to={`/products/${item.product._id}`} className="shrink-0">
                    <img src={imgSrc} alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-100"
                      onError={e => e.target.src = FALLBACK} />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/products/${item.product._id}`}>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-green-700 transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                          {item.product.subcategory?.replace(/-/g, ' ') || 'Dairy'}
                          {item.product.farmingDetails?.isOrganic && ' · 🌿 Organic'}
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          ✅ In Stock · {item.product.farmer?.farmName || 'Local Farm'}
                        </p>
                      </div>
                      <button onClick={() => { removeFromCart(item.product._id); toast.success('Item removed'); }}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1">
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Price */}
                      <div>
                        <span className="text-lg font-extrabold text-gray-900">₹{fmt(itemTotal)}</span>
                        <span className="text-xs text-gray-400 ml-1.5">₹{item.product.price.amount}/{item.product.price.unit}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-400 hover:text-green-600 font-bold text-lg transition-all">
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity >= maxQty) { toast.error(`Only ${maxQty} available`); return; }
                            updateQuantity(item.product._id, item.quantity + 1);
                          }}
                          className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-400 hover:text-green-600 font-bold text-lg transition-all">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Low stock warning */}
                    {maxQty <= 10 && (
                      <p className="text-xs text-orange-500 font-medium mt-2">⚠️ Only {maxQty} left in stock!</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link to="/products"
              className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:underline mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Price Details Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Price Details</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price ({cartItems.length} items)</span>
                  <span className="font-medium">₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>
                    {deliveryFee === 0 ? '🎉 FREE' : `₹${fmt(deliveryFee)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (5%)</span>
                  <span className="font-medium">₹{fmt(tax)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-5">
                <div className="flex justify-between font-extrabold text-base">
                  <span>Total Amount</span>
                  <span className="text-green-700">₹{fmt(total)}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-green-600 mt-1 font-medium">You're saving ₹50 on delivery!</p>
                )}
              </div>

              <button onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-extrabold text-sm hover:bg-green-700 transition-all shadow-md hover:shadow-lg">
                Proceed to Checkout →
              </button>

              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p>🔒 Safe & Secure Payments</p>
                <p>🚚 Easy Returns & Refunds</p>
                <p>✅ 100% Genuine Farm Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
