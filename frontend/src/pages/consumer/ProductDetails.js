import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ReviewSystem from '../../components/common/ReviewSystem';
import toast from 'react-hot-toast';

const FALLBACK_IMAGES = {
  'fresh-milk':    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=500&fit=crop&auto=format',
  'flavored-milk': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&h=500&fit=crop&auto=format',
  'butter-cream':  'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=500&fit=crop&auto=format',
  'paneer-cheese': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=500&fit=crop&auto=format',
  'ghee':          'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600&h=500&fit=crop&auto=format',
  'curd-dahi':     'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&h=500&fit=crop&auto=format',
  'drinks':        'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&h=500&fit=crop&auto=format',
  'default':       'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=500&fit=crop&auto=format',
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgSrc, setImgSrc]     = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res  = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/products/${id}`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        setProduct(data);
        const url = data.images?.[0]?.url;
        setImgSrc(url && url.startsWith('http') ? url : FALLBACK_IMAGES[data.subcategory] || FALLBACK_IMAGES.default);
      } catch (error) {
        console.error('Product details fetch error:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-grass-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-grass-200 border-t-grass-600 rounded-full animate-spin" />
        <p className="text-grass-600 text-sm">Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-grass-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🥛</div>
        <h2 className="text-xl font-bold text-grass-900 mb-3">Product not found</h2>
        <Link to="/products" className="btn-primary text-sm">← Back to Products</Link>
      </div>
    </div>
  );

  const outOfStock = product.stock?.quantity === 0;
  const inWish     = isInWishlist(product._id);
  const total      = (product.price?.amount * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-grass-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-grass-500 mb-5">
          <Link to="/" className="hover:text-grass-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-grass-700">Products</Link>
          <span>/</span>
          <span className="text-grass-800 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-grass-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Image Panel ── */}
            <div className="relative bg-grass-50 flex items-center justify-center min-h-[320px] lg:min-h-[480px] overflow-hidden">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImgSrc(FALLBACK_IMAGES[product.subcategory] || FALLBACK_IMAGES.default)}
              />
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.farmingDetails?.isOrganic && (
                  <span className="bg-grass-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    🌿 Organic Certified
                  </span>
                )}
                {outOfStock && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Out of Stock
                  </span>
                )}
              </div>
              {/* Freshness badge */}
              {product.freshness?.freshnessScore && (
                <div className="absolute bottom-4 right-4 bg-white rounded-xl px-3 py-2 shadow-md border border-grass-100 text-center">
                  <p className="text-grass-700 font-extrabold text-lg leading-none">{product.freshness.freshnessScore}%</p>
                  <p className="text-grass-500 text-xs">Freshness</p>
                </div>
              )}
            </div>

            {/* ── Info Panel ── */}
            <div className="p-6 lg:p-8 flex flex-col">
              <p className="text-grass-500 text-xs font-semibold uppercase tracking-widest mb-1 capitalize">
                {product.subcategory?.replace('-', ' ') || 'Dairy'}
              </p>
              <h1 className="text-2xl font-extrabold text-grass-900 mb-3 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= Math.round(product.rating?.average || 4) ? 'text-yellow-400' : 'text-grass-200'}>★</span>
                  ))}
                </div>
                <span className="text-sm text-grass-600 font-medium">
                  {(product.rating?.average || 4).toFixed(1)} ({product.rating?.count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-extrabold text-grass-700">₹{product.price?.amount}</span>
                <span className="text-grass-500 text-sm">per {product.price?.unit}</span>
              </div>

              <p className="text-grass-700 text-sm leading-relaxed mb-5">{product.description}</p>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Category',       value: product.category },
                  { label: 'Method',         value: product.farmingDetails?.method },
                  { label: 'Stock',          value: `${product.stock?.quantity} ${product.stock?.unit}` },
                  { label: 'Harvest Date',   value: product.freshness?.harvestDate ? new Date(product.freshness.harvestDate).toLocaleDateString('en-IN') : 'Today' },
                ].map(d => (
                  <div key={d.label} className="bg-grass-50 rounded-xl p-3 border border-grass-100">
                    <p className="text-xs text-grass-500 mb-0.5">{d.label}</p>
                    <p className="text-sm font-semibold text-grass-800 capitalize">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-semibold text-grass-700">Quantity:</span>
                <div className="flex items-center border border-grass-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-grass-700 hover:bg-grass-50 font-bold text-lg transition-colors"
                  >−</button>
                  <span className="w-12 text-center font-bold text-grass-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock?.quantity || 99, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-grass-700 hover:bg-grass-50 font-bold text-lg transition-colors"
                  >+</button>
                </div>
                <span className="text-sm text-grass-500">{product.price?.unit}</span>
              </div>

              {/* Total */}
              <div className="bg-grass-50 rounded-xl p-4 border border-grass-100 mb-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-grass-700">Total Amount</span>
                <span className="text-2xl font-extrabold text-grass-700">₹{total}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (inWish) { removeFromWishlist(product._id); toast.success('Removed from wishlist'); }
                    else        { addToWishlist(product);          toast.success('Added to wishlist ❤️'); }
                  }}
                  className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    inWish
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-grass-200 bg-white text-grass-600 hover:border-grass-400'
                  }`}
                >
                  {inWish ? '❤️ Saved' : '🤍 Save'}
                </button>
                <button
                  onClick={() => { addToCart(product, quantity); toast.success(`Added to cart! 🛒`); }}
                  disabled={outOfStock}
                  className="flex-1 py-3 rounded-xl border-2 border-grass-700 text-grass-700 font-bold text-sm hover:bg-grass-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {outOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/checkout');
                  }}
                  disabled={outOfStock}
                  className="flex-1 py-3 rounded-xl bg-grass-700 text-white font-bold text-sm hover:bg-grass-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {outOfStock ? 'Out of Stock' : '⚡ Buy Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-grass-100 p-6 lg:p-8">
            <ReviewSystem
              productId={product._id}
              currentRating={product.rating?.average}
              reviewCount={product.rating?.count}
            />
          </div>

          {/* Farmer Info */}
          <div className="border-t border-grass-100 p-6 lg:p-8">
            <h3 className="text-base font-bold text-grass-900 mb-4">👨‍🌾 About the Farmer</h3>
            <div className="flex items-center gap-4 bg-grass-50 rounded-2xl p-4 border border-grass-100">
              <div className="w-14 h-14 bg-grass-700 rounded-full flex items-center justify-center text-2xl shrink-0">
                👨‍🌾
              </div>
              <div>
                <p className="font-bold text-grass-900">{product.farmer?.farmName || 'Local Farm'}</p>
                <p className="text-grass-600 text-sm">✅ Verified Farmer</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <span className="text-xs text-grass-500">4.5 rating</span>
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
