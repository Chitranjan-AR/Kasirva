import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    farmingMethod: '',
    location: '',
    sortBy: 'newest',
    inStock: false
  });
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
        if (filters.inStock) queryParams.append('inStock', 'true');
        
        const url = `/products?${queryParams.toString()}`;
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}${url}`);
        const data = await response.json();
        
        console.log('API Response:', data);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.farmingMethod, filters.location, filters.sortBy, filters.inStock]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const categories = ['dairy'];
  const farmingMethods = ['organic', 'natural'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fresh Milk Products</h1>
        
        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search milk products..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="input-field"
            />
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="input-field"
            >
              <option value="">All Dairy Products</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Location (city/state)"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="input-field"
            />
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.farmingMethod}
              onChange={(e) => setFilters({...filters, farmingMethod: e.target.value})}
              className="input-field"
            >
              <option value="">All Methods</option>
              {farmingMethods.map(method => (
                <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              className="input-field"
            />
            
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="input-field"
            />
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {products.length} products found
            </span>
            <button
              onClick={() => setFilters({
                category: '', search: '', minPrice: '', maxPrice: '', 
                farmingMethod: '', location: '', sortBy: 'newest', inStock: false
              })}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop';
                  }}
                />
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{product.price.amount}/{product.price.unit}
                    </span>
                    {product.farmingDetails.isOrganic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Organic
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock.quantity} {product.stock.unit}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm ml-1">{product.rating.average.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
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
                      className={`p-2 rounded ${isInWishlist(product._id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80`}
                    >
                      {isInWishlist(product._id) ? '❤️' : '🤍'}
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded text-center text-sm hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No milk products found. Please run the database seeder first.</p>
            <p className="text-sm text-gray-400 mt-2">Backend: npm run seed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;