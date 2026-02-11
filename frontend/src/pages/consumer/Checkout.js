import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    delivery: {
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || ''
      },
      method: 'farmer_delivery',
      slot: {
        date: '',
        timeSlot: '9:00 AM - 12:00 PM'
      }
    },
    payment: {
      method: 'cod'
    }
  });

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: typeof value === 'object' ? { ...prev[section][field], ...value } : value
      }
    }));
  };

  const handlePlaceOrder = async () => {
    if (!orderData.delivery.address.street || !orderData.delivery.slot.date) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        delivery: orderData.delivery,
        payment: orderData.payment
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${data.order._id}`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={orderData.delivery.address.street}
                  onChange={(e) => handleInputChange('delivery', 'address', { street: e.target.value })}
                  className="input-field"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={orderData.delivery.address.city}
                    onChange={(e) => handleInputChange('delivery', 'address', { city: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={orderData.delivery.address.state}
                    onChange={(e) => handleInputChange('delivery', 'address', { state: e.target.value })}
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={orderData.delivery.address.pincode}
                  onChange={(e) => handleInputChange('delivery', 'address', { pincode: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Delivery Slot */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Delivery Slot</h2>
              <div className="space-y-4">
                <input
                  type="date"
                  value={orderData.delivery.slot.date}
                  onChange={(e) => handleInputChange('delivery', 'slot', { date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
                <select
                  value={orderData.delivery.slot.timeSlot}
                  onChange={(e) => handleInputChange('delivery', 'slot', { timeSlot: e.target.value })}
                  className="input-field"
                >
                  <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                  <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={orderData.payment.method === 'cod'}
                    onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                    className="mr-3"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={orderData.payment.method === 'online'}
                    onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                    className="mr-3"
                  />
                  Online Payment
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{(item.product.price.amount * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;