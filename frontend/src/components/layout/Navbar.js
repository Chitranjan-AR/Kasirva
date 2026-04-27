import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import NotificationPanel from '../common/NotificationPanel';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navigation = {
    consumer: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'My Orders', href: '/my-orders' },
    ],
    farmer: [
      { name: 'Dashboard', href: '/farmer/dashboard' },
      { name: 'My Products', href: '/farmer/products' },
      { name: 'Profile', href: '/farmer/profile' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard' },
    ],
  };

  const guestNav = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
  ];

  const currentNavigation = user ? navigation[user.role] || [] : guestNav;

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const avatarInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="bg-emerald-900 text-white text-center text-xs py-2 px-4 font-medium tracking-wide">
        🎉 Free delivery on your first order! Use code{' '}
        <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold mx-1">
          DAIRY1
        </span>{' '}
        at checkout.
      </div>

      {/* ── Main Navbar ── */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-700 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-extrabold text-lg">K</span>
              </div>
              <span className="text-xl font-extrabold text-stone-900">
                Kshi<span className="text-emerald-700">rva</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className={`hidden md:flex items-center flex-1 max-w-xs border rounded-xl overflow-hidden transition-all ${
                searchFocused ? 'border-emerald-500 shadow-md' : 'border-stone-200'
              } bg-stone-50`}
            >
              <span className="pl-3 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search milk, ghee, paneer..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-stone-700 outline-none placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="bg-emerald-700 text-white px-3 py-2 text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Go
                </button>
              )}
            </form>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user.role === 'consumer' && (
                    <>
                      {/* Wishlist */}
                      <Link
                        to="/wishlist"
                        className="relative p-2.5 rounded-xl text-stone-500 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Wishlist"
                      >
                        <span className="text-xl">🤍</span>
                        {wishlistCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>

                      {/* Cart */}
                      <Link
                        to="/cart"
                        className="relative p-2.5 rounded-xl text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-all"
                        title="Cart"
                      >
                        <span className="text-xl">🛒</span>
                        {cartItems.length > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* Notifications */}
                  <NotificationPanel />

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {avatarInitials}
                      </div>
                      <span className="text-sm font-medium text-stone-700 max-w-[80px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                      <span className={`text-stone-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-amber-100 mb-1">
                          <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                          <p className="text-xs text-stone-400 capitalize">{user.role}</p>
                        </div>
                        {user.role === 'consumer' && (
                          <>
                            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800">
                              📦 My Orders
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800">
                              🤍 Wishlist
                            </Link>
                          </>
                        )}
                        {user.role === 'farmer' && (
                          <>
                            <Link to="/farmer/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800">
                              📊 Dashboard
                            </Link>
                            <Link to="/farmer/products" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800">
                              🐄 My Products
                            </Link>
                          </>
                        )}
                        <div className="border-t border-amber-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            🚪 Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-stone-600 hover:text-amber-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-amber-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-700 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-amber-800 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && user.role === 'consumer' && (
                <Link to="/cart" className="relative p-2 text-gray-600">
                  <span className="text-xl">🛒</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-amber-100 shadow-lg">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 pt-3 pb-2">
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <span className="pl-3 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="bg-amber-700 text-white px-4 py-2.5 text-sm font-semibold">
                  Search
                </button>
              </div>
            </form>

            <div className="px-3 pb-4 space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-amber-50 text-amber-800 font-semibold'
                      : 'text-stone-700 hover:bg-amber-50 hover:text-amber-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl mt-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-700 to-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                      <p className="text-xs text-stone-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-1"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2.5 rounded-xl bg-amber-700 text-white text-sm font-semibold hover:bg-amber-800"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
