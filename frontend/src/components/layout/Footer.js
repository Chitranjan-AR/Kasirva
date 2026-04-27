import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('🎉 Subscribed! Welcome to Kshirva family.');
    setEmail('');
  };

  const links = {
    shop: [
      { label: 'Fresh Milk',    to: '/products' },
      { label: 'Desi Ghee',     to: '/products' },
      { label: 'Paneer',        to: '/products' },
      { label: 'Curd & Dahi',   to: '/products' },
      { label: 'All Products',  to: '/products' },
    ],
    company: [
      { label: 'About Us',      to: '/about'   },
      { label: 'Join as Farmer',to: '/farmers' },
      { label: 'Contact Us',    to: '/contact' },
      { label: 'FAQ',           to: '/faq'     },
    ],
    support: [
      { label: 'Help Center',     to: '/help'    },
      { label: 'Track Order',     to: '/my-orders'},
      { label: 'Terms of Service',to: '/terms'   },
      { label: 'Privacy Policy',  to: '/privacy' },
    ],
  };

  const stats = [
    { value: '500+',  label: 'Verified Farmers', icon: '👨‍🌾' },
    { value: '50K+',  label: 'Happy Families',   icon: '😊'   },
    { value: '30+',   label: 'Cities Covered',   icon: '🏙️'  },
    { value: '99%',   label: 'Fresh Guarantee',  icon: '✅'   },
  ];

  const socials = [
    {
      name: 'Facebook', href: 'https://facebook.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram', href: 'https://instagram.com',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      name: 'Twitter', href: 'https://twitter.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
        </svg>
      ),
    },
    {
      name: 'YouTube', href: 'https://youtube.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
          <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0f1a0f] text-white">

      {/* ── Stats Bar ── */}
      <div className="border-b border-white/5 bg-[#162016]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-extrabold text-emerald-400 leading-none">{s.value}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <span className="text-white font-extrabold text-xl">K</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Kshi<span className="text-emerald-400">rva</span>
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed mb-5 max-w-xs">
              India's trusted farm-to-consumer dairy marketplace. Pure A2 milk, desi ghee & fresh dairy — delivered daily from verified local farmers.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['🔒 SSL Secured', '✅ Verified Farmers', '🚚 Daily Delivery'].map(b => (
                <span key={b} className="text-xs bg-white/5 border border-white/10 text-stone-300 px-2.5 py-1 rounded-full">
                  {b}
                </span>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-700 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {links.shop.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-emerald-400 transition-colors shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-2.5">
              {links.company.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-emerald-400 transition-colors shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Support</h3>
            <ul className="space-y-2.5 mb-7">
              {links.support.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-emerald-400 transition-colors shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-2">Newsletter</p>
              <p className="text-xs text-stone-500 mb-3">Get fresh deals & farm updates</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-600 focus:bg-white/8 transition-all"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5 bg-[#0a120a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-stone-500 text-xs">
              © {new Date().getFullYear()} Kshirva Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <Link to="/terms"   className="hover:text-stone-300 transition-colors">Terms</Link>
              <span className="text-stone-700">·</span>
              <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
              <span className="text-stone-700">·</span>
              <Link to="/faq"     className="hover:text-stone-300 transition-colors">FAQ</Link>
              <span className="text-stone-700">·</span>
              <span>Made with 🐄 in India</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
