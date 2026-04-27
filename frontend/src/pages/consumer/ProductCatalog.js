import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

/* ── Reliable dairy image map by subcategory ── */
const FALLBACK_IMAGES = {
  'fresh-milk':    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format',
  'flavored-milk': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop&auto=format',
  'butter-cream':  'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop&auto=format',
  'paneer-cheese': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&auto=format',
  'ghee':          'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&h=300&fit=crop&auto=format',
  'curd-dahi':     'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&h=300&fit=crop&auto=format',
  'drinks':        'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop&auto=format',
  'default':       'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format',
};

const getImage = (product) => {
  const url = product.images?.[0]?.url;
  if (url && url.startsWith('http')) return url;
  return FALLBACK_IMAGES[product.subcategory] || FALLBACK_IMAGES.default;
};

const CATEGORIES = [
  { value: '',              label: 'All Products',    emoji: '🥛' },
  { value: 'fresh-milk',   label: 'Fresh Milk',      emoji: '🐄' },
  { value: 'ghee',         label: 'Desi Ghee',       emoji: '🧈' },
  { value: 'paneer-cheese',label: 'Paneer & Cheese', emoji: '🧀' },
  { value: 'curd-dahi',    label: 'Curd & Dahi',     emoji: '🫙' },
  { value: 'butter-cream', label: 'Butter & Cream',  emoji: '🍦' },
  { value: 'drinks',       label: 'Lassi & Drinks',  emoji: '🥤' },
  { value: 'flavored-milk',label: 'Flavored Milk',   emoji: '🍫' },
];

const ProductCatalog = () => {
  const location = useLocation();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [imgErrors, setImgErrors] = useState({});
  const [filters, setFilters]     = useState({
    category: '',
    search: new URLSearchParams(location.search).get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false,
  });

  const { addToCart, cartItems, getCartTotal } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = new URLSearchParams();
        q.append('category', 'dairy');
        if (filters.category) q.append('subcategory', filters.category);
        if (filters.search)   q.append('search', filters.search);
        if (filters.minPrice) q.append('minPrice', filters.minPrice);
        if (filters.maxPrice) q.append('maxPrice', filters.maxPrice);
        if (filters.sortBy)   q.append('sortBy', filters.sortBy);
        if (filters.inStock)  q.append('inStock', 'true');

        const res  = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/products?${q}`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        let list = data.products || [];

        // client-side subcategory filter
        if (filters.category) list = list.filter(p => p.subcategory === filters.category);
        setProducts(list);
      } catch (error) {
        console.error('Product fetch error:', error);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.sortBy, filters.inStock]);

  const handleImgError = (id, subcategory) => {
    setImgErrors(prev => ({ ...prev, [id]: FALLBACK_IMAGES[subcategory] || FALLBACK_IMAGES.default }));
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️');
    }
  };

  const clearFilters = () => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sortBy: 'newest', inStock: false });

  return (
    <div className="min-h-screen bg-grass-50">

      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1">🥛 Fresh Dairy Products</h1>
          <p className="text-grass-200 text-sm">Farm-fresh, pure & delivered daily to your door</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Category Pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilters(f => ({ ...f, category: cat.value }))}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filters.category === cat.value
                  ? 'bg-grass-700 text-white border-grass-700 shadow-md'
                  : 'bg-white text-grass-700 border-grass-200 hover:border-grass-400'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl border border-grass-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="input-field col-span-1 lg:col-span-2"
            />
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
              className="input-field"
            />
            <select
              value={filters.sortBy}
              onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))}
                className="w-4 h-4 accent-grass-600 rounded"
              />
              <span className="text-sm text-grass-700 font-medium">In Stock Only</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-grass-600 font-medium">{products.length} products</span>
              <button onClick={clearFilters} className="text-xs text-grass-600 hover:text-grass-800 underline">
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Products Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 border-4 border-grass-200 border-t-grass-600 rounded-full animate-spin" />
            <p className="text-grass-600 text-sm font-medium">Loading fresh products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥛</div>
            <p className="text-grass-700 font-semibold text-lg mb-1">No products found</p>
            <p className="text-grass-500 text-sm mb-4">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => {
              const imgSrc = imgErrors[product._id] || getImage(product);
              const inWish = isInWishlist(product._id);
              const outOfStock = product.stock?.quantity === 0;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-grass-100 overflow-hidden hover:shadow-lg hover:border-grass-300 transition-all group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-grass-50 h-44">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImgError(product._id, product.subcategory)}
                      loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.farmingDetails?.isOrganic && (
                        <span className="bg-grass-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          🌿 Organic
                        </span>
                      )}
                      {outOfStock && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    {/* Wishlist btn */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
                        inWish ? 'bg-red-500 text-white' : 'bg-white text-grass-400 hover:text-red-500'
                      }`}
                    >
                      {inWish ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs text-grass-500 font-medium mb-0.5">
                      {CATEGORIES.find(c => c.value === product.subcategory)?.emoji || '🥛'}{' '}
                      {CATEGORIES.find(c => c.value === product.subcategory)?.label || 'Dairy'}
                    </p>
                    <h3 className="text-sm font-bold text-grass-900 leading-snug mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating?.average || 4))}</span>
                      <span className="text-xs text-grass-500">({product.rating?.count || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3 mt-auto">
                      <span className="text-lg font-extrabold text-grass-700">
                        ₹{product.price?.amount}
                      </span>
                      <span className="text-xs text-grass-500">/{product.price?.unit}</span>
                    </div>

                    {/* Stock bar */}
                    {!outOfStock && product.stock?.quantity <= 20 && (
                      <div className="mb-2">
                        <p className="text-xs text-orange-500 font-medium mb-1">
                          Only {product.stock.quantity} left!
                        </p>
                        <div className="w-full bg-grass-100 rounded-full h-1">
                          <div
                            className="bg-orange-400 h-1 rounded-full"
                            style={{ width: `${Math.min((product.stock.quantity / 20) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="flex-1 text-center py-2 rounded-xl border border-grass-200 text-grass-700 text-xs font-semibold hover:bg-grass-50 transition-all"
                      >
                        👁️ View Details
                      </Link>
                      <button
                        onClick={() => { addToCart(product, 1); toast.success(`${product.name} added to cart! 🛒`); }}
                        disabled={outOfStock}
                        className="flex-1 py-2 rounded-xl bg-grass-700 text-white text-xs font-bold hover:bg-grass-800 transition-all disabled:bg-grass-200 disabled:text-grass-400 disabled:cursor-not-allowed"
                      >
                        {outOfStock ? 'Out of Stock' : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Cart Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-grass-700 text-white p-4 rounded-2xl shadow-2xl z-50 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Cart Summary</span>
              <span className="bg-grass-600 text-xs px-2 py-1 rounded-full">{cartItems.length} items</span>
            </div>
            <div className="text-sm mb-3">
              Total: <span className="font-bold text-lg">₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Link
                to="/cart"
                className="flex-1 bg-white text-grass-700 py-2 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                className="flex-1 bg-grass-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-grass-500 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}

        {/* Quick Add Modal or Toast Enhancement */}
        {/* Add some helpful tips */}
        <div className="mt-8 bg-grass-50 border border-grass-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-grass-900 mb-4">🛒 How to Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="bg-grass-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-grass-900">Browse Products</p>
                <p className="text-grass-700">Find fresh dairy products from verified farmers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-grass-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-grass-900">Add to Cart</p>
                <p className="text-grass-700">Click "Add to Cart" or adjust quantities as needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-grass-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-grass-900">Checkout & Pay</p>
                <p className="text-grass-700">Choose delivery slot and payment method</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
