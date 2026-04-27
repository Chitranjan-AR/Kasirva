import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="bg-white p-12 rounded-lg shadow">
            <span className="text-6xl mb-4 block">💝</span>
            <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save products you love for later</p>
            <Link to="/products" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50"
                >
                  <span className="text-red-500">❤️</span>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price.amount}/{product.price.unit}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm ml-1">{(product.rating?.average || 0).toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded text-center text-sm hover:bg-gray-200"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
