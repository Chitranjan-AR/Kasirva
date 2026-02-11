import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ReviewSystem from '../../components/common/ReviewSystem';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.price.unit} of ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-green-600 hover:text-green-800">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="text-green-600 hover:text-green-800 mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=400&fit=crop'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  ₹{product.price.amount}/{product.price.unit}
                </span>
                {product.farmingDetails.isOrganic && (
                  <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Organic Certified
                  </span>
                )}
              </div>

              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-lg">★★★★★</span>
                <span className="ml-2 text-gray-600">
                  {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Farming Method:</span>
                  <span className="capitalize">{product.farmingDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stock Available:</span>
                  <span>{product.stock.quantity} {product.stock.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Freshness Score:</span>
                  <span className="text-green-600 font-semibold">{product.freshness.freshnessScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Harvest Date:</span>
                  <span>{new Date(product.freshness.harvestDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock.quantity, quantity + 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500">{product.price.unit}</span>
              </div>

              {/* Add to Cart */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                      toast.success('Removed from wishlist');
                    } else {
                      addToWishlist(product);
                      toast.success('Added to wishlist');
                    }
                  }}
                  className={`p-3 rounded-lg border-2 ${isInWishlist(product._id) ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 bg-white text-gray-600'} hover:bg-opacity-80`}
                >
                  {isInWishlist(product._id) ? '❤️ Saved' : '🤍 Save'}
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock.quantity === 0}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <Link
                  to="/cart"
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  View Cart
                </Link>
              </div>

              {/* Total Price */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(product.price.amount * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-8">
            <ReviewSystem 
              productId={product._id} 
              currentRating={product.rating.average} 
              reviewCount={product.rating.count} 
            />
          </div>
          {/* Farmer Info */}
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-bold mb-4">About the Farmer</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <div>
                <p className="font-semibold">{product.farmer?.farmName || 'Local Farm'}</p>
                <p className="text-gray-600">Verified Farmer</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm">4.5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;