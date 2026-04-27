import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   ABOUT US
───────────────────────────────────────── */
export const AboutUs = () => (
  <div className="min-h-screen bg-grass-50">
    {/* Hero */}
    <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-16 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">🐄 About Kshirva</h1>
      <p className="text-grass-200 max-w-xl mx-auto text-sm md:text-base">
        Bridging the gap between dairy farmers and families — delivering purity, trust, and freshness every day.
      </p>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Mission */}
      <section className="bg-white rounded-2xl border border-grass-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-grass-800 mb-3">🌿 Our Mission</h2>
        <p className="text-grass-700 leading-relaxed">
          Kshirva was founded with a simple belief — every family deserves pure, farm-fresh dairy products, and every
          farmer deserves a fair price for their hard work. We connect local dairy farmers directly with consumers,
          cutting out middlemen and ensuring freshness from farm to doorstep.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { num: '500+', label: 'Verified Farmers' },
          { num: '50K+', label: 'Happy Families' },
          { num: '100+', label: 'Cities Served' },
          { num: '99%',  label: 'Freshness Rate' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-grass-100 shadow-sm p-6 text-center">
            <p className="text-3xl font-extrabold text-grass-700">{s.num}</p>
            <p className="text-sm text-grass-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <section className="bg-white rounded-2xl border border-grass-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-grass-800 mb-5">💚 Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🌾', title: 'Farmer First',   desc: 'We ensure farmers get fair prices and direct access to consumers.' },
            { icon: '🥛', title: 'Pure & Fresh',   desc: 'Every product is sourced fresh daily with strict quality checks.' },
            { icon: '🤝', title: 'Trust & Transparency', desc: 'Full traceability — you know exactly which farm your milk comes from.' },
          ].map(v => (
            <div key={v.title} className="text-center">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-grass-800 mb-1">{v.title}</h3>
              <p className="text-sm text-grass-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link to="/products" className="inline-block bg-grass-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-grass-800 transition-all">
          Shop Fresh Dairy →
        </Link>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll reply within 24 hours 📩');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-grass-50">
      <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">📞 Contact Us</h1>
        <p className="text-grass-200 text-sm md:text-base">We'd love to hear from you. Reach out anytime!</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: '📧', title: 'Email',   val: 'support@kshirva.com' },
            { icon: '📱', title: 'Phone',   val: '+91 98765 43210' },
            { icon: '🕐', title: 'Hours',   val: 'Mon–Sat, 8 AM – 8 PM IST' },
            { icon: '📍', title: 'Address', val: 'Kshirva HQ, Pune, Maharashtra, India' },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-grass-100 shadow-sm p-5 flex items-start gap-4">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-bold text-grass-800 text-sm">{c.title}</p>
                <p className="text-grass-600 text-sm">{c.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-grass-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-grass-800">Send a Message</h2>
          <input
            className="input-field w-full"
            placeholder="Your Name *"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            className="input-field w-full"
            placeholder="Email Address *"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="input-field w-full"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          />
          <textarea
            rows={4}
            className="input-field w-full resize-none"
            placeholder="Your message *"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-grass-700 text-white font-bold py-3 rounded-xl hover:bg-grass-800 transition-all disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Message 📩'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   FARMERS (Join as Farmer)
───────────────────────────────────────── */
export const Farmers = () => (
  <div className="min-h-screen bg-grass-50">
    <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-16 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">🌾 Join as a Farmer</h1>
      <p className="text-grass-200 text-sm md:text-base max-w-xl mx-auto">
        Sell your dairy products directly to thousands of families. No middlemen. Better prices. More control.
      </p>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Benefits */}
      <section className="bg-white rounded-2xl border border-grass-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-grass-800 mb-6">✅ Why Join Kshirva?</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: '💰', title: 'Better Earnings',       desc: 'Earn 30–40% more by selling directly to consumers.' },
            { icon: '📦', title: 'Easy Order Management', desc: 'Simple dashboard to manage products, orders & payments.' },
            { icon: '🚀', title: 'Instant Reach',         desc: 'Access thousands of customers in your city from day one.' },
            { icon: '🔒', title: 'Secure Payments',       desc: 'Get paid directly to your bank account, on time, every time.' },
            { icon: '📊', title: 'Analytics',             desc: 'Track your sales, earnings, and customer feedback easily.' },
            { icon: '🤝', title: 'Dedicated Support',     desc: 'Our team helps you onboard and grow your dairy business.' },
          ].map(b => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="font-bold text-grass-800 text-sm">{b.title}</p>
                <p className="text-grass-600 text-xs">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white rounded-2xl border border-grass-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-grass-800 mb-6">🚀 How to Get Started</h2>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Register',        desc: 'Create your farmer account with basic details.' },
            { step: '02', title: 'Verify',          desc: 'Upload your documents for quick verification (24–48 hrs).' },
            { step: '03', title: 'Add Products',    desc: 'List your dairy products with photos, prices & stock.' },
            { step: '04', title: 'Start Selling',   desc: 'Receive orders and deliver fresh to customers.' },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-grass-700 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                {s.step}
              </div>
              <div>
                <p className="font-bold text-grass-800 text-sm">{s.title}</p>
                <p className="text-grass-600 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link to="/register" className="inline-block bg-grass-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-grass-800 transition-all">
          Register as Farmer →
        </Link>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   HELP CENTER (PROFESSIONAL & INTERACTIVE)
───────────────────────────────────────── */
export const HelpCenter = () => {
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq]     = useState(null);
  const [helpful, setHelpful]     = useState({});

  const categories = [
    { id: 'all',      label: 'All Topics',        icon: '🏠' },
    { id: 'orders',   label: 'Orders & Delivery',  icon: '📦' },
    { id: 'payments', label: 'Payments & Refunds', icon: '💳' },
    { id: 'account',  label: 'Account',            icon: '👤' },
    { id: 'farmers',  label: 'For Farmers',        icon: '🌾' },
    { id: 'products', label: 'Products',           icon: '🥛' },
  ];

  const faqs = [
    { cat: 'orders',   q: 'How do I place an order?',                    a: 'Browse products → Add to Cart → Checkout. Choose your delivery address, time slot, and payment method. Your order will be confirmed instantly.' },
    { cat: 'orders',   q: 'How do I track my order?',                    a: 'Go to My Orders from the navbar or dashboard. Click "Track" on any order to see real-time status updates from the farmer.' },
    { cat: 'orders',   q: 'Can I cancel my order?',                      a: 'Yes, orders can be cancelled before the farmer starts preparing them. Go to My Orders → Track → Cancel Order. Cancellation is free.' },
    { cat: 'orders',   q: 'What are the delivery time slots?',           a: 'We offer 5 delivery slots: 6–9 AM, 9 AM–12 PM, 12–3 PM, 3–6 PM, and 6–9 PM. Choose your preferred slot at checkout.' },
    { cat: 'orders',   q: 'Is there a minimum order value?',             a: 'No minimum order! Order as little or as much as you need. Free delivery on orders above ₹500.' },
    { cat: 'payments', q: 'What payment methods are accepted?',          a: 'We accept Cash on Delivery (COD). Online payments via UPI, Credit/Debit Cards, and Net Banking are coming soon.' },
    { cat: 'payments', q: 'How do refunds work?',                        a: 'Refunds for cancelled orders are processed within 5–7 business days to your original payment method. COD orders are refunded via bank transfer.' },
    { cat: 'payments', q: 'My payment failed but money was deducted?',   a: 'If payment was deducted but order not placed, the amount will be auto-refunded within 3–5 business days. Contact support if it takes longer.' },
    { cat: 'payments', q: 'Do you charge any extra fees?',               a: 'We charge 5% GST and ₹50 delivery fee on orders below ₹500. No hidden charges. Free delivery on orders above ₹500.' },
    { cat: 'account',  q: 'How do I create an account?',                 a: 'Click "Get Started" on the homepage. Fill in your name, email, phone, and password. Choose Consumer or Farmer role and you are ready!' },
    { cat: 'account',  q: 'I forgot my password. What do I do?',        a: 'Click "Forgot Password" on the login page. Enter your registered email or phone number and follow the reset instructions.' },
    { cat: 'account',  q: 'How do I update my delivery address?',        a: 'You can enter a new delivery address at checkout for each order. Profile address management is coming soon.' },
    { cat: 'farmers',  q: 'How do I register as a farmer?',              a: 'Register with the "Farmer" role. After registration, complete your farm profile and upload verification documents. Approval takes 24–48 hours.' },
    { cat: 'farmers',  q: 'What documents are needed for verification?', a: 'You need a valid Aadhaar card, farm registration certificate, and a bank account for payments. Upload them in your farmer profile.' },
    { cat: 'farmers',  q: 'How do I add my products?',                   a: 'Go to Farmer Dashboard → My Products → Add Product. Fill in product details, price, stock, and farming method.' },
    { cat: 'farmers',  q: 'When do I get paid?',                         a: 'Payments are processed after order delivery confirmation. Funds are transferred to your registered bank account within 2–3 business days.' },
    { cat: 'products', q: 'Are the products really fresh?',              a: 'Yes! All products are sourced daily from local farms. Milk and curd are delivered within 12 hours of production. Check the freshness score on each product.' },
    { cat: 'products', q: 'What does the Organic badge mean?',           a: 'The 🌿 Organic badge means the product is grown/produced without synthetic chemicals or pesticides, verified by our team.' },
    { cat: 'products', q: 'What if I receive a wrong or damaged product?', a: 'Contact us within 2 hours of delivery with a photo. We will arrange a replacement or full refund immediately — no questions asked.' },
  ];

  const filtered = faqs.filter(f =>
    (activeTab === 'all' || f.cat === activeTab) &&
    (search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  const popularTopics = faqs.slice(0, 5);

  const handleHelpful = (idx, isHelpful) => {
    setHelpful(h => ({ ...h, [idx]: isHelpful }));
    toast.success(isHelpful ? '👍 Thanks for the feedback!' : '👎 We\'ll improve this');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#f1f5ee] to-[#ecf5f0]">

      {/* ═══════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════ */}
      <div className="bg-gradient-to-br from-[#1e7145] via-[#2d8659] to-[#1a6340] text-white py-16 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-3 font-semibold text-amber-100 text-sm tracking-widest uppercase">
            📚 Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            How can we help you?
          </h1>
          <p className="text-amber-50 text-lg mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse by category to find quick answers
          </p>

          {/* Advanced Search */}
          <div className="relative max-w-2xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveTab('all'); }}
              placeholder="Search help articles... e.g., cancel order, refund, tracking"
              className="w-full pl-14 pr-12 py-4 rounded-xl text-slate-800 text-base outline-none shadow-2xl focus:ring-2 focus:ring-green-300 focus:shadow-lg transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-300 hover:text-green-200 text-xl hover:bg-white/10 rounded-lg p-1 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ─────────────────────────────────────
            CONTACT OPTIONS CARDS
            ───────────────────────────────────── */}
        {!search && activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#e0f7ec] border-2 border-[#a7d8bd] rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
              <span className="text-4xl">💬</span>
              <div className="flex-1">
                <p className="font-bold text-base text-[#1e7145] mb-1">Live Chat</p>
                <p className="text-sm opacity-80 text-[#2d8659] mb-3">Available 9 AM – 6 PM</p>
                <Link 
                  to="/contact" 
                  className="text-sm font-bold underline hover:no-underline opacity-90 hover:opacity-100 transition-opacity text-[#1e7145]"
                >
                  Start Chat →
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#e0f7ec] border-2 border-[#a7d8bd] rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
              <span className="text-4xl">📧</span>
              <div className="flex-1">
                <p className="font-bold text-base text-[#1e7145] mb-1">Email Us</p>
                <p className="text-sm opacity-80 text-[#2d8659] mb-3">support@kshirva.com</p>
                <Link 
                  to="/contact" 
                  className="text-sm font-bold underline hover:no-underline opacity-90 hover:opacity-100 transition-opacity text-[#1e7145]"
                >
                  Send Email →
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#e0f7ec] border-2 border-[#a7d8bd] rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
              <span className="text-4xl">📞</span>
              <div className="flex-1">
                <p className="font-bold text-base text-[#1e7145] mb-1">Call Support</p>
                <p className="text-sm opacity-80 text-[#2d8659] mb-3">+91 98765 43210</p>
                <Link 
                  to="/contact" 
                  className="text-sm font-bold underline hover:no-underline opacity-90 hover:opacity-100 transition-opacity text-[#1e7145]"
                >
                  Call Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────
            CATEGORY TABS
            ───────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold text-[#1e7145] uppercase tracking-widest mb-3">
            Browse by Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); setSearch(''); setOpenFaq(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  activeTab === cat.id
                    ? 'bg-[#2d8659] text-white border-[#1e7145] shadow-md'
                    : 'bg-[#f0fdf4] text-[#1e7145] border-[#a7d8bd] hover:border-[#2d8659] hover:bg-[#e0f7ec]'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────
            SEARCH RESULTS / FAQ SECTION
            ───────────────────────────────────── */}
        <div>
          {search && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#2d8659]">
                Found <span className="font-bold text-[#1e7145]">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''} for <span className="font-bold text-[#1e7145]">"{search}"</span>
              </p>
              <button 
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-[#2d8659] hover:text-[#1e7145] underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* No Results State */}
          {filtered.length === 0 ? (
            <div className="bg-[#f0fdf4] rounded-xl border-2 border-dashed border-[#a7d8bd] p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-[#1e7145] mb-2">No results found</p>
              <p className="text-[#2d8659] mb-6">
                We couldn't find answers matching your search. Try different keywords or browse by category.
              </p>
              <button 
                onClick={() => { setSearch(''); setActiveTab('all'); }}
                className="bg-[#2d8659] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e7145] transition-all"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((f, i) => {
                const catIcon = categories.find(c => c.id === f.cat)?.icon || '❓';
                return (
                  <div 
                    key={i} 
                    className="bg-[#f0fdf4] rounded-lg border border-[#a7d8bd] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#dff7ec] transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{catIcon}</span>
                        <span className="font-semibold text-[#1e7145] group-hover:text-[#0f5f35] transition-colors text-sm md:text-base line-clamp-2">{f.q}</span>
                      </div>
                      <span className={`text-[#52b788] text-2xl ml-4 flex-shrink-0 transition-transform duration-300 group-hover:text-[#2d8659] ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>

                    {/* Expanded Answer */}
                    {openFaq === i && (
                      <div className="px-6 pb-5 bg-gradient-to-b from-[#dff7ec] to-[#f0fdf4] border-t border-[#a7d8bd] animate-in fade-in duration-200">
                        <p className="pt-4 text-[#2d8659] leading-relaxed text-sm md:text-base">{f.a}</p>
                        
                        {/* Feedback Section */}
                        <div className="mt-5 pt-4 border-t border-[#a7d8bd] flex items-center gap-4">
                          <span className="text-xs text-[#2d8659] font-semibold">Was this helpful?</span>
                          <button 
                            onClick={() => handleHelpful(i, true)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              helpful[i] === true 
                                ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                                : 'bg-[#e0f7ec] text-[#1e7145] hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            👍 Yes
                          </button>
                          <button 
                            onClick={() => handleHelpful(i, false)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              helpful[i] === false 
                                ? 'bg-red-100 text-red-700 shadow-sm'
                                : 'bg-[#e0f7ec] text-[#1e7145] hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            👎 No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────
            POPULAR TOPICS (Show when no search)
            ───────────────────────────────────── */}
        {!search && activeTab === 'all' && (
          <>
            <div className="mt-16 mb-8">
              <h2 className="text-2xl font-extrabold text-[#1e7145] mb-6">Popular Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTopics.map((topic, idx) => {
                  const catIcon = categories.find(c => c.id === topic.cat)?.icon || '❓';
                  return (
                    <button
                      key={idx}
                      onClick={() => { setSearch(topic.q); setActiveTab('all'); }}
                      className="text-left bg-[#f0fdf4] hover:bg-[#e0f7ec] border border-[#a7d8bd] hover:border-[#2d8659] rounded-lg p-5 transition-all duration-200 hover:shadow-md group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{catIcon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1e7145] group-hover:text-[#0f5f35] transition-colors text-sm line-clamp-2">{topic.q}</p>
                          <p className="text-xs text-[#2d8659] mt-1">Quick answer available</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─────────────────────────────────────
                QUICK LINKS SECTION
                ───────────────────────────────────── */}
            <div className="mb-16">
              <h2 className="text-2xl font-extrabold text-[#1e7145] mb-6">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#f0fdf4] border border-[#a7d8bd] rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-[#2d8659]">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-bold text-[#1e7145] text-sm mb-1">Getting Started</h3>
                  <p className="text-xs text-[#2d8659]">Learn how to register and place your first order</p>
                </div>
                <div className="bg-[#f0fdf4] border border-[#a7d8bd] rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-[#2d8659]">
                  <div className="text-3xl mb-3">🛒</div>
                  <h3 className="font-bold text-[#1e7145] text-sm mb-1">Shopping Guide</h3>
                  <p className="text-xs text-[#2d8659]">Tips for browsing and selecting fresh dairy</p>
                </div>
                <div className="bg-[#f0fdf4] border border-[#a7d8bd] rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-[#2d8659]">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="font-bold text-[#1e7145] text-sm mb-1">Pricing & Payment</h3>
                  <p className="text-xs text-[#2d8659]">Understand our fees and payment options</p>
                </div>
                <div className="bg-[#f0fdf4] border border-[#a7d8bd] rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-[#2d8659]">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-bold text-[#1e7145] text-sm mb-1">Account & Security</h3>
                  <p className="text-xs text-[#2d8659]">Manage your profile and stay secure</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═════════════════════════════════════
          FOOTER CTA / STILL NEED HELP
          ═════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#1e7145] via-[#2d8659] to-[#1a6340] text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-3xl font-extrabold mb-3">Still need help?</h2>
          <p className="text-green-50 mb-8 text-lg">
            Our dedicated support team is here to assist you. We typically respond within 2 hours.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="font-semibold mb-1">📞 Call Us</p>
              <p className="text-green-50 text-sm">+91 98765 43210</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="font-semibold mb-1">📧 Email</p>
              <p className="text-green-50 text-sm">support@kshirva.com</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="font-semibold mb-1">🕐 Hours</p>
              <p className="text-green-50 text-sm">Mon–Sat, 8 AM – 8 PM</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/contact"
              className="bg-[#f0fdf4] text-[#1e7145] px-8 py-3 rounded-lg font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl"
            >
              Contact Support →
            </Link>
            <button 
              onClick={() => window.scrollTo(0, 0)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   TERMS OF SERVICE
───────────────────────────────────────── */
export const TermsOfService = () => (
  <div className="min-h-screen bg-grass-50">
    <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-16 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">📋 Terms of Service</h1>
      <p className="text-grass-200 text-sm">Last updated: January 2025</p>
    </div>

    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      {[
        {
          title: '1. Acceptance of Terms',
          body: 'By accessing or using Kshirva, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.',
        },
        {
          title: '2. Use of Platform',
          body: 'Kshirva is a marketplace connecting dairy farmers with consumers. You agree to use the platform only for lawful purposes and in accordance with these terms.',
        },
        {
          title: '3. User Accounts',
          body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.',
        },
        {
          title: '4. Orders & Payments',
          body: 'All orders placed on Kshirva are subject to availability. Payments are processed securely. Prices are inclusive of applicable taxes unless stated otherwise.',
        },
        {
          title: '5. Farmer Responsibilities',
          body: 'Farmers are responsible for the accuracy of product listings, quality of products, and timely fulfillment of orders. Misrepresentation may result in account suspension.',
        },
        {
          title: '6. Refunds & Cancellations',
          body: 'Refunds are processed within 5–7 business days for eligible cancellations. Perishable items may not be eligible for refund once delivered.',
        },
        {
          title: '7. Limitation of Liability',
          body: 'Kshirva is not liable for any indirect, incidental, or consequential damages arising from the use of our platform or products purchased through it.',
        },
        {
          title: '8. Changes to Terms',
          body: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.',
        },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-grass-100 shadow-sm p-6">
          <h2 className="font-bold text-grass-800 mb-2">{s.title}</h2>
          <p className="text-grass-600 text-sm leading-relaxed">{s.body}</p>
        </div>
      ))}

      <p className="text-center text-grass-500 text-xs">
        Questions? <Link to="/contact" className="text-grass-700 underline">Contact us</Link>
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   PRIVACY POLICY
───────────────────────────────────────── */
const PP_SECTIONS = [
  {
    id: 'information-collected',
    title: '1. Information We Collect',
    content: [
      { type: 'p', text: 'Kshirva collects the following categories of personal information:' },
      { type: 'ul', items: [
        'Identity Data: Full name, username, date of birth',
        'Contact Data: Email address, phone number, delivery address',
        'Transaction Data: Order history, payment records, refund details',
        'Technical Data: IP address, browser type, device identifiers, cookies',
        'Usage Data: Pages visited, features used, time spent on platform',
        'Farmer-Specific Data: Farm registration documents, Aadhaar, bank account details',
      ]},
      { type: 'p', text: 'We collect this information when you register, place an order, contact support, or interact with our platform.' },
    ],
  },
  {
    id: 'use-of-information',
    title: '2. How We Use Your Information',
    content: [
      { type: 'p', text: 'We process your personal data for the following lawful purposes:' },
      { type: 'ul', items: [
        'To create and manage your account',
        'To process and fulfill orders, including delivery coordination',
        'To send transactional notifications (order confirmation, delivery updates)',
        'To verify farmer identity and farm credentials',
        'To process payments and issue refunds',
        'To improve platform features and user experience',
        'To comply with legal and regulatory obligations',
        'To send promotional communications (only with your consent)',
      ]},
      { type: 'p', text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.' },
    ],
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing & Disclosure',
    content: [
      { type: 'p', text: 'We may share your information with the following parties under strict confidentiality obligations:' },
      { type: 'ul', items: [
        'Farmers: Delivery address and contact number shared solely for order fulfillment',
        'Payment Processors: Razorpay handles all payment data under PCI-DSS compliance; we do not store card details',
        'Logistics Partners: Name and address shared for delivery coordination',
        'Cloud Services: AWS/Cloudinary for secure data and media storage',
        'Legal Authorities: When required by law, court order, or to protect our legal rights',
      ]},
      { type: 'p', text: 'All third-party service providers are contractually bound to protect your data and use it only for specified purposes.' },
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies & Tracking',
    content: [
      { type: 'p', text: 'We use cookies and similar tracking technologies to enhance your experience:' },
      { type: 'ul', items: [
        'Essential Cookies: Required for login sessions and cart functionality',
        'Analytics Cookies: Help us understand how users interact with the platform (Google Analytics)',
        'Preference Cookies: Remember your language, location, and display settings',
      ]},
      { type: 'p', text: 'You may disable non-essential cookies through your browser settings or our cookie consent banner. Disabling essential cookies may affect platform functionality.' },
    ],
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    content: [
      { type: 'p', text: 'We implement industry-standard technical and organizational measures to protect your data:' },
      { type: 'ul', items: [
        'All data transmitted is encrypted using TLS 1.2+ (SSL)',
        'Passwords are hashed using bcrypt and never stored in plain text',
        'Access to personal data is restricted to authorized personnel only',
        'Regular security audits and vulnerability assessments are conducted',
        'Two-factor authentication is available for all accounts',
      ]},
      { type: 'p', text: 'Despite our best efforts, no method of transmission over the internet is 100% secure. In the event of a data breach, we will notify affected users within 72 hours as required by applicable law.' },
    ],
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: [
      { type: 'p', text: 'We retain your personal data only for as long as necessary:' },
      { type: 'ul', items: [
        'Active account data: Retained for the duration of your account',
        'Order and transaction records: Retained for 7 years for tax and legal compliance',
        'Marketing preferences: Until you withdraw consent',
        'Deleted accounts: Anonymized within 30 days of deletion request',
      ]},
    ],
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    content: [
      { type: 'p', text: 'Under applicable data protection laws, you have the following rights:' },
      { type: 'ul', items: [
        'Right to Access: Request a copy of the personal data we hold about you',
        'Right to Rectification: Correct inaccurate or incomplete data',
        'Right to Erasure: Request deletion of your personal data (right to be forgotten)',
        'Right to Portability: Receive your data in a structured, machine-readable format',
        'Right to Object: Object to processing based on legitimate interests or for direct marketing',
        'Right to Withdraw Consent: Withdraw consent at any time without affecting prior processing',
      ]},
      { type: 'p', text: 'To exercise any of these rights, contact us at privacy@kshirva.com. We will respond within 30 days.' },
    ],
  },
  {
    id: 'childrens-privacy',
    title: "8. Children's Privacy",
    content: [
      { type: 'p', text: 'Kshirva is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal data, we will delete such information immediately.' },
      { type: 'p', text: 'If you believe a minor has registered on our platform, please contact us at privacy@kshirva.com.' },
    ],
  },
  {
    id: 'third-party-links',
    title: '9. Third-Party Links',
    content: [
      { type: 'p', text: 'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party services you visit.' },
    ],
  },
  {
    id: 'policy-changes',
    title: '10. Changes to This Policy',
    content: [
      { type: 'p', text: 'We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When we make material changes, we will:' },
      { type: 'ul', items: [
        'Update the "Last Updated" date at the top of this document',
        'Send an email notification to registered users',
        'Display a prominent notice on our platform',
      ]},
      { type: 'p', text: 'Continued use of Kshirva after the effective date of changes constitutes acceptance of the updated policy.' },
    ],
  },
  {
    id: 'contact',
    title: '11. Contact & Grievance Officer',
    content: [
      { type: 'p', text: 'For any privacy-related concerns, requests, or complaints, please contact our designated Grievance Officer:' },
      { type: 'ul', items: [
        'Name: Privacy & Compliance Team, Kshirva',
        'Email: privacy@kshirva.com',
        'Address: Kshirva Technologies Pvt. Ltd., Pune, Maharashtra - 411001, India',
        'Response Time: Within 30 days of receipt',
      ]},
      { type: 'p', text: 'If you are not satisfied with our response, you may lodge a complaint with the relevant data protection authority in your jurisdiction.' },
    ],
  },
];

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('information-collected');

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderContent = (content) =>
    content.map((block, i) => {
      if (block.type === 'p') return <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{block.text}</p>;
      if (block.type === 'ul') return (
        <ul key={i} className="mb-3 space-y-1.5 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-grass-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
      return null;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Official Header */}
      <div className="bg-white border-b border-gray-200 print:border-0">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-grass-600 bg-grass-50 border border-grass-200 px-2.5 py-0.5 rounded">Legal Document</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Privacy Policy</h1>
              <p className="text-gray-500 text-sm mt-1">Kshirva Technologies Pvt. Ltd.</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                <span>📅 Effective Date: January 1, 2025</span>
                <span>🔄 Last Updated: January 2025</span>
                <span>📄 Version 1.0</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="print:hidden shrink-0 flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 text-xs text-blue-800 leading-relaxed">
            <strong>Important Notice:</strong> This Privacy Policy describes how Kshirva Technologies Pvt. Ltd. collects, uses, and protects your personal information when you use our platform. By using Kshirva, you agree to the practices described in this document.
          </div>
        </div>
      </div>

      {/* Body: Sidebar + Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8 items-start">

        {/* Left Sidebar — Table of Contents */}
        <aside className="print:hidden w-64 shrink-0 sticky top-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Table of Contents</p>
            </div>
            <nav className="py-2">
              {PP_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-4 py-2.5 text-xs leading-snug transition-all border-l-2 ${
                    activeSection === s.id
                      ? 'border-grass-600 bg-grass-50 text-grass-800 font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Quick Info</p>
            <p className="text-xs text-gray-600">🏢 Kshirva Technologies Pvt. Ltd.</p>
            <p className="text-xs text-gray-600">📍 Pune, Maharashtra, India</p>
            <p className="text-xs text-gray-600">✉️ privacy@kshirva.com</p>
            <p className="text-xs text-gray-600">⚖️ Governed by Indian IT Act, 2000</p>
          </div>
        </aside>

        {/* Right — Document Content */}
        <main className="flex-1 min-w-0">
          {PP_SECTIONS.map((s, idx) => (
            <section
              key={s.id}
              id={s.id}
              className="bg-white border border-gray-200 rounded-xl p-6 mb-4 scroll-mt-6"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-full bg-grass-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h2 className="font-bold text-gray-900 text-base">{s.title.replace(/^\d+\.\s/, '')}</h2>
              </div>
              {renderContent(s.content)}
            </section>
          ))}

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-400 mb-1">© 2025 Kshirva Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="text-xs text-gray-400">This document was last reviewed by our legal team in January 2025.</p>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <Link to="/terms" className="text-grass-700 hover:underline">Terms of Service</Link>
              <span className="text-gray-300">|</span>
              <Link to="/contact" className="text-grass-700 hover:underline">Contact Us</Link>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          aside, button { display: none !important; }
          main { width: 100% !important; }
          section { break-inside: avoid; border: 1px solid #e5e7eb !important; margin-bottom: 12px; }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
export const FAQ = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: 'How fresh are the products?',                  a: 'All products are sourced daily from local farmers. Milk and curd are delivered within 12 hours of production.' },
    { q: 'How do I track my order?',                     a: 'After placing an order, go to your Dashboard → Orders. You\'ll see real-time status updates and estimated delivery time.' },
    { q: 'What payment methods are accepted?',           a: 'We accept UPI, credit/debit cards, net banking, and cash on delivery (select areas).' },
    { q: 'Can I cancel or modify my order?',             a: 'Orders can be cancelled within 30 minutes of placing. After that, cancellation depends on the farmer\'s dispatch status.' },
    { q: 'How are farmers verified?',                    a: 'Every farmer goes through a document verification process (Aadhaar, farm registration). Our team reviews and approves within 24–48 hours.' },
    { q: 'Is there a minimum order value?',              a: 'No minimum order value. Order as little or as much as you need!' },
    { q: 'Do you deliver every day?',                    a: 'Yes! We deliver 7 days a week. Delivery slots are 6–9 AM and 5–8 PM depending on your location.' },
    { q: 'How do I become a farmer on Kshirva?',        a: 'Click "Join as Farmer" in the footer or register with the Farmer role. After document verification, you can start listing products.' },
    { q: 'What if I receive a wrong or damaged product?', a: 'Contact us within 2 hours of delivery with a photo. We\'ll arrange a replacement or full refund immediately.' },
    { q: 'Are the products organic?',                    a: 'Many of our farmers are certified organic. Look for the 🌿 Organic badge on product listings.' },
  ];

  return (
    <div className="min-h-screen bg-grass-50">
      <div className="bg-gradient-to-r from-grass-800 to-grass-600 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">❓ Frequently Asked Questions</h1>
        <p className="text-grass-200 text-sm md:text-base">Everything you need to know about Kshirva.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-grass-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-semibold text-grass-800 text-sm">{f.q}</span>
              <span className="text-grass-500 text-lg ml-4">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-sm text-grass-600 leading-relaxed border-t border-grass-50">
                <p className="pt-3">{f.a}</p>
              </div>
            )}
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-grass-600 text-sm mb-3">Didn't find your answer?</p>
          <Link to="/contact" className="inline-block bg-grass-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-grass-800 transition-all text-sm">
            Ask Us Directly →
          </Link>
        </div>
      </div>
    </div>
  );
};
