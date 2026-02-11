import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '📦' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order?.status?.current);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/dashboard" className="text-green-600 hover:text-green-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-green-600 hover:text-green-800 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Order Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status.current)}`}>
                {order.status.current.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Progress */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    index <= currentStepIndex 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs mt-2 text-center ${
                    index <= currentStepIndex ? 'text-green-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div className={`h-1 w-full mt-2 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/64x64/22c55e/ffffff?text=🥬'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.totalPrice}</p>
                    <p className="text-sm text-gray-600">₹{item.price}/{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{order.delivery?.address?.street}</p>
                <p>{order.delivery?.address?.city}, {order.delivery?.address?.state}</p>
                <p>{order.delivery?.address?.pincode}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Farmer Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.farmer?.farmName}</p>
                <p className="text-gray-600">Verified Farmer</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm">4.5 rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.pricing?.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{order.pricing?.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{order.pricing?.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">₹{order.pricing?.total}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Payment Method:</strong> {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Payment Status:</strong> {order.payment?.status}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {order.status?.current === 'delivered' && !order.review?.rating && (
            <div className="mt-6 text-center">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Rate & Review Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;