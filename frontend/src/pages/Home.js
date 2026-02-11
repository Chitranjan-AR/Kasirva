import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      title: 'Fresh from Farm',
      description: 'Get the freshest produce directly from local farmers',
      icon: '🌱'
    },
    {
      title: 'No Middlemen',
      description: 'Direct connection between farmers and consumers',
      icon: '🤝'
    },
    {
      title: 'Organic Certified',
      description: 'Verified organic and natural farming methods',
      icon: '✅'
    },
    {
      title: 'Real-time Tracking',
      description: 'Track your orders from farm to your doorstep',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh Farm Produce
              <span className="block text-yellow-300">Delivered to You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect directly with local farmers and get the freshest vegetables, 
              fruits, and organic produce delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-yellow-400 text-green-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/products"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
                  >
                    Browse Products
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'farmer' ? '/farmer/dashboard' : '/products'}
                  className="bg-yellow-400 text-green-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  {user.role === 'farmer' ? 'Go to Dashboard' : 'Shop Now'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kashirva?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the way you buy fresh produce by connecting 
              you directly with local farmers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore fresh produce from verified local farmers in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Order</h3>
              <p className="text-gray-600">
                Add items to cart and choose your preferred delivery slot
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Delivered</h3>
              <p className="text-gray-600">
                Receive fresh produce at your doorstep with real-time tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Fresh?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of customers who trust Kashirva for their daily fresh produce needs.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-yellow-400 text-green-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Start Shopping Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;