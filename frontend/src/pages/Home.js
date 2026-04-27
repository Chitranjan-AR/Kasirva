import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const flashSaleProducts = [
  { id: 1, name: 'Full Cream Milk', originalPrice: 70,  salePrice: 55,  unit: 'L',    emoji: '🥛', discount: 21, stock: 18 },
  { id: 2, name: 'Desi Cow Ghee',   originalPrice: 650, salePrice: 499, unit: '500g', emoji: '🧈', discount: 23, stock: 5  },
  { id: 3, name: 'Fresh Paneer',    originalPrice: 320, salePrice: 249, unit: '250g', emoji: '🧀', discount: 22, stock: 9  },
  { id: 4, name: 'Curd / Dahi',     originalPrice: 80,  salePrice: 59,  unit: '500g', emoji: '🫙', discount: 26, stock: 14 },
];

const dairySpecials = [
  { name: 'A2 Desi Milk',  emoji: '🥛', tag: 'Most Popular',  price: '₹70/L',      color: 'from-emerald-800 to-green-600'  },
  { name: 'Malai Lassi',   emoji: '🥤', tag: 'Summer Special', price: '₹49/glass',  color: 'from-amber-700 to-orange-500'  },
  { name: 'Shrikhand',     emoji: '🍮', tag: 'Limited Batch',  price: '₹199/250g',  color: 'from-yellow-600 to-amber-500'  },
  { name: 'Butter Milk',   emoji: '🫗', tag: 'Probiotic Rich', price: '₹30/500ml',  color: 'from-lime-700 to-emerald-500'    },
];

const categories = [
  { name: 'Fresh Milk',  emoji: '🥛', color: 'bg-emerald-50  text-emerald-800  border-emerald-200'  },
  { name: 'Desi Ghee',  emoji: '🧈', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'Paneer',     emoji: '🧀', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { name: 'Curd & Dahi',emoji: '🫙', color: 'bg-lime-50   text-lime-800   border-lime-200'   },
  { name: 'Lassi',      emoji: '🥤', color: 'bg-stone-50  text-stone-700  border-stone-200'  },
  { name: 'Butter',     emoji: '🧈', color: 'bg-yellow-50 text-yellow-900 border-yellow-300' },
];

const features = [
  { icon: '🐄', title: 'Desi Cow Milk',    desc: 'Pure A2 milk, daily fresh.'       },
  { icon: '🤝', title: 'Zero Middlemen',   desc: 'Direct from farmer to you.'       },
  { icon: '✅', title: 'Verified Farmers', desc: 'Every farmer is verified.'        },
  { icon: '📦', title: 'Live Tracking',    desc: 'Farm to door, real-time.'         },
  { icon: '💰', title: 'Best Prices',      desc: 'No retail markup, ever.'          },
  { icon: '🔄', title: 'Easy Returns',     desc: 'Hassle-free, full refund.'        },
];

const testimonials = [
  { name: 'Priya Sharma', location: 'Pune',      avatar: 'PS', text: 'The A2 milk is so pure and creamy! My kids love it. Never going back to packaged milk.'          },
  { name: 'Rahul Mehta',  location: 'Mumbai',    avatar: 'RM', text: 'Desi ghee from Kshirva is absolutely authentic. You can smell the difference instantly!'       },
  { name: 'Anita Desai',  location: 'Bangalore', avatar: 'AD', text: 'Fresh paneer delivered same morning. Softer than anything I have bought from a store.'          },
];

const liveActivities = [
  { user: 'Sneha R.',   city: 'Pune',      item: 'Full Cream Milk 2L',          time: '2m ago'  },
  { user: 'Amit K.',    city: 'Mumbai',    item: 'Desi Cow Ghee 500g',          time: '4m ago'  },
  { user: 'Pooja M.',   city: 'Nashik',    item: 'Fresh Paneer 250g ⭐⭐⭐⭐⭐', time: '6m ago'  },
  { user: 'Ravi S.',    city: 'Bangalore', item: 'A2 Desi Milk 1L',             time: '9m ago'  },
  { user: 'Kavita D.',  city: 'Hyderabad', item: 'Curd / Dahi 500g',            time: '11m ago' },
];

const steps = [
  { icon: '🔍', step: '01', title: 'Browse',    desc: 'Find pure dairy near you'    },
  { icon: '🛒', step: '02', title: 'Order',     desc: 'Pick your delivery slot'     },
  { icon: '🚚', step: '03', title: 'Delivered', desc: 'Fresh at your doorstep'      },
];

/* ── countdown hook ── */
function useCountdown(hours = 5) {
  const end = useRef(Date.now() + hours * 3_600_000);
  const [t, setT] = useState({ h: hours, m: 0, s: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      const d = Math.max(0, end.current - Date.now());
      setT({
        h: Math.floor(d / 3_600_000),
        m: Math.floor((d % 3_600_000) / 60_000),
        s: Math.floor((d % 60_000) / 1_000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const pad = (n) => String(n).padStart(2, '0');

/* ══════════════════════════════════════════════════════════ */
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [tIdx, setTIdx] = useState(0);
  const [aIdx, setAIdx] = useState(0);
  const timer = useCountdown(5);

  useEffect(() => {
    const id = setInterval(() => setTIdx((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAIdx((p) => (p + 1) % liveActivities.length), 3000);
    return () => clearInterval(id);
  }, []);

  const shopLink = user?.role === 'farmer' ? '/farmer/dashboard' : '/products';
  const shopLabel = user?.role === 'farmer' ? 'Go to Dashboard →' : 'Shop Now →';

  return (
    <div className="min-h-screen bg-green-50 text-stone-900">

      {/* ══ HERO ══ */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-300 opacity-10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white opacity-5 rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* left */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                🐄 100% Pure Desi Dairy
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                Pure Dairy,
                <span className="block text-emerald-200">Delivered Fresh.</span>
              </h1>
              <p className="text-emerald-100 text-sm md:text-base mb-6 max-w-md leading-relaxed">
                Skip packaged milk. Order pure A2 milk, ghee &amp; dairy directly
                from local farmers — same day delivery to your door.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register"
                      className="bg-emerald-100 text-emerald-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-md hover:-translate-y-0.5">
                      Start Shopping Free →
                    </Link>
                    <Link to="/products"
                      className="border-2 border-emerald-200 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-100 hover:text-emerald-900 transition-all">
                      Browse Products
                    </Link>
                  </>
                ) : (
                  <Link to={shopLink}
                    className="bg-emerald-100 text-emerald-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-md">
                    {shopLabel}
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-emerald-200 text-xs">
                <span>✔ Free delivery on first order</span>
                <span>✔ No subscription needed</span>
                <span>✔ 100% refund guarantee</span>
              </div>
            </div>

            {/* right — stats */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { v: '500+', l: 'Local Farmers',   e: '👨🌾' },
                { v: '10K+', l: 'Happy Customers', e: '😊'   },
                { v: '50+',  l: 'Dairy Products',  e: '🥛'   },
                { v: '30+',  l: 'Cities Covered',  e: '🏙️'  },
              ].map((s) => (
                <div key={s.l}
                  className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.e}</div>
                  <div className="text-2xl font-extrabold text-emerald-200">{s.v}</div>
                  <div className="text-emerald-100 text-xs mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE TICKER ══ */}
      <div className="bg-emerald-900 text-white py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
          <span className="shrink-0 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
          <span className="text-emerald-300 font-semibold">{liveActivities[aIdx].user}</span>
          <span className="text-emerald-400">from {liveActivities[aIdx].city}</span>
          <span className="text-white">just ordered</span>
          <span className="text-yellow-300 font-medium truncate">{liveActivities[aIdx].item}</span>
          <span className="text-emerald-500 ml-auto shrink-0">{liveActivities[aIdx].time}</span>
        </div>
      </div>

      {/* ══ FLASH SALE ══ */}
      <section className="py-8 bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-extrabold text-sm">
                ⚡ Flash Sale
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-xs">Ends in</span>
                {[pad(timer.h), pad(timer.m), pad(timer.s)].map((v, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-stone-800 text-white font-mono font-bold text-sm px-2 py-1 rounded-md">
                      {v}
                    </span>
                    {i < 2 && <span className="text-stone-400 text-xs font-bold">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <Link to="/products" className="text-emerald-700 text-xs font-semibold hover:underline shrink-0">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flashSaleProducts.map((p) => (
              <Link key={p.id} to="/products"
                className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all relative">
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  -{p.discount}%
                </span>
                <div className="text-4xl text-center mb-2">{p.emoji}</div>
                <p className="text-xs font-semibold text-stone-800 mb-1 truncate">{p.name}</p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base font-extrabold text-red-600">₹{p.salePrice}</span>
                  <span className="text-xs text-stone-400 line-through">₹{p.originalPrice}</span>
                  <span className="text-xs text-stone-400">/{p.unit}</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-orange-600 font-medium mb-1">Only {p.stock} left!</p>
                  <div className="w-full bg-emerald-100 rounded-full h-1">
                    <div className="bg-emerald-500 h-1 rounded-full"
                      style={{ width: `${Math.min((p.stock / 20) * 100, 100)}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="py-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-stone-900">Shop by Category</h2>
            <Link to="/products" className="text-amber-700 text-xs font-semibold hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link key={cat.name} to="/products"
                className={`${cat.color} border rounded-xl py-3 px-2 text-center hover:scale-105 transition-transform`}>
                <div className="text-3xl mb-1">{cat.emoji}</div>
                <div className="font-semibold text-xs leading-tight">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DAIRY SPECIALS ══ */}
      <section className="py-8 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-stone-900">🐄 Dairy Specials</h2>
            <Link to="/products" className="text-amber-700 text-xs font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dairySpecials.map((item) => (
              <Link key={item.name} to="/products"
                className={`bg-gradient-to-br ${item.color} rounded-xl p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden group`}>
                <div className="text-5xl mb-2">{item.emoji}</div>
                <span className="inline-block bg-white bg-opacity-25 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-1">
                  {item.tag}
                </span>
                <p className="text-white font-bold text-sm">{item.name}</p>
                <p className="text-white opacity-90 text-xs font-semibold mt-0.5">{item.price}</p>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section className="py-8 bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-stone-900 mb-5">Why Customers Love Kshirva</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {features.map((f) => (
              <div key={f.title}
                className="bg-white border border-emerald-100 rounded-xl p-4 text-center hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="text-3xl mb-2">{f.icon}</div>
                <p className="text-xs font-bold text-stone-800 mb-1">{f.title}</p>
                <p className="text-xs text-stone-500 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-8 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-stone-900 text-center mb-7">How It Works</h2>
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-emerald-200" />
                )}
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center mx-auto mb-2 text-xl shadow-md">
                  {s.icon}
                </div>
                <span className="text-xs text-emerald-600 font-bold">Step {s.step}</span>
                <p className="text-sm font-bold text-stone-900">{s.title}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIAL + APP ══ */}
      <section className="py-8 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-5">

          {/* Testimonial card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
            <div>
              <p className="text-emerald-500 text-base mb-2">{'★'.repeat(5)}</p>
              <p className="text-stone-700 text-sm italic leading-relaxed mb-4">
                "{testimonials[tIdx].text}"
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {testimonials[tIdx].avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{testimonials[tIdx].name}</p>
                  <p className="text-xs text-stone-400">{testimonials[tIdx].location}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`rounded-full transition-all h-2 ${i === tIdx ? 'bg-emerald-700 w-5' : 'bg-stone-300 w-2'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* App download card */}
          <div className="bg-stone-900 rounded-2xl p-6 text-white flex items-center gap-5">
            {/* mini phone mockup */}
            <div className="shrink-0 w-20 h-32 bg-stone-800 rounded-2xl border-2 border-stone-700 flex flex-col items-center justify-center gap-1.5 p-2">
              <div className="w-full bg-amber-700 rounded-lg p-1.5 text-center">
                <div className="text-base">🥛</div>
                <p className="text-white font-bold leading-none" style={{ fontSize: '7px' }}>Kshirva</p>
              </div>
              {['🥛 ₹55/L', '🧈 ₹499', '🧀 ₹249'].map((item) => (
                <div key={item} className="w-full bg-stone-700 rounded px-1 py-0.5 text-stone-300 truncate"
                  style={{ fontSize: '7px' }}>
                  {item}
                </div>
              ))}
              <div className="w-full bg-amber-400 text-stone-900 rounded text-center font-bold"
                style={{ fontSize: '7px' }}>
                Order →
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-emerald-400 text-xs font-semibold">📱 Mobile App</span>
              <h3 className="text-sm font-bold mt-1 mb-2 leading-snug">
                Shop smarter on the{' '}
                <span className="text-emerald-400">Kshirva App</span>
              </h3>
              <div className="space-y-1 mb-3">
                {['🔔 Restock alerts', '🎁 App-only deals', '⚡ 1-tap reorder'].map((f) => (
                  <p key={f} className="text-stone-400 text-xs">{f}</p>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="bg-emerald-100 text-stone-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-all">
                  🍎 App Store
                </button>
                <button className="bg-emerald-100 text-stone-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-all">
                  ▶️ Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FARMER BANNER ══ */}
      <section className="py-8 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-800 to-yellow-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">👨🌾</span>
              <div className="text-white">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
                  For Dairy Farmers
                </p>
                <h3 className="text-xl font-extrabold mb-1">Sell Directly. Earn More.</h3>
                <p className="text-amber-200 text-sm">
                  Join 500+ farmers · ₹0 commission for 3 months · Get paid directly
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="text-center bg-white bg-opacity-10 rounded-xl px-5 py-3 text-white">
                <div className="text-2xl font-extrabold text-amber-300">₹2L+</div>
                <div className="text-amber-200 text-xs">Avg Monthly Earnings</div>
              </div>
              <Link to="/register"
                className="bg-amber-100 text-amber-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-md whitespace-nowrap">
                Register as Farmer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="bg-gradient-to-r from-amber-800 to-yellow-700 text-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
            Ready for Pure Fresh Dairy?
          </h2>
          <p className="text-amber-100 text-sm mb-6">
            Join 10,000+ families. Your first delivery is on us.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register"
                className="bg-amber-100 text-amber-900 px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg hover:-translate-y-0.5">
                Create Free Account →
              </Link>
              <Link to="/products"
                className="border-2 border-amber-200 text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-100 hover:text-amber-900 transition-all">
                Browse Products
              </Link>
            </div>
          ) : (
            <Link to="/products"
              className="bg-amber-100 text-amber-900 px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg">
              Shop Now →
            </Link>
          )}
          <p className="text-amber-300 text-xs mt-4">
            No credit card · Free first delivery · Cancel anytime
          </p>
        </div>
      </section>

    </div>
  );
}
