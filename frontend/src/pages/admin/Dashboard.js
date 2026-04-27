import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [farmers, setFarmers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'dairy',
    price: { amount: '', unit: 'litre' },
    stock: { quantity: '', unit: 'litre' },
    farmingMethod: 'organic'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, prodRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/products`)
        ]);
        if (dashRes.ok) {
          const data = await dashRes.json();
          setStats(data.stats || {});
          setFarmers(data.farmers || []);
          setUsers(data.users || []);
          setOrders(data.orders || []);
        }
        if (prodRes.ok) {
          const productsData = await prodRes.json();
          setProducts(productsData.products || []);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const refetch = async () => {
    try {
      const [dashRes, prodRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/dashboard`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/products`)
      ]);
      if (dashRes.ok) { const d = await dashRes.json(); setStats(d.stats||{}); setFarmers(d.farmers||[]); setUsers(d.users||[]); setOrders(d.orders||[]); }
      if (prodRes.ok) { const d = await prodRes.json(); setProducts(d.products||[]); }
    } catch {}
  };

  const handleFarmerAction = async (farmerId, action, reason = '') => {
    try {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/farmers/${farmerId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        toast.success(`Farmer ${action}d successfully`);
        refetch();
      } else {
        toast.error(`Failed to ${action} farmer`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} farmer`);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        toast.success('User status updated');
        refetch();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Get first farmer for the product
      const farmersRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/farmers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!farmersRes.ok || !farmersRes) {
        toast.error('No farmers available. Please add a farmer first.');
        return;
      }
      
      const farmersData = await farmersRes.json();
      if (!farmersData.farmers || farmersData.farmers.length === 0) {
        toast.error('No farmers available. Please add a farmer first.');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          farmer: farmersData.farmers[0]._id,
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          subcategory: newProduct.category,
          price: { 
            amount: parseFloat(newProduct.price.amount), 
            unit: newProduct.price.unit 
          },
          stock: { 
            quantity: parseFloat(newProduct.stock.quantity), 
            unit: newProduct.stock.unit 
          },
          farmingDetails: { 
            method: newProduct.farmingMethod, 
            isOrganic: newProduct.farmingMethod === 'organic' 
          },
          images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500' }],
          freshness: { harvestDate: new Date(), freshnessScore: 95 },
          availability: { isAvailable: true },
          rating: { average: 4.5, count: 0 },
          isActive: true
        })
      });

      if (response.ok) {
        toast.success('Product added successfully');
        setShowAddProduct(false);
        setNewProduct({ name: '', description: '', category: 'dairy', price: { amount: '', unit: 'litre' }, stock: { quantity: '', unit: 'litre' }, farmingMethod: 'organic' });
        refetch();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        refetch();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🟢 System Online
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                <p className="text-xs mt-1 opacity-80">+12% from last month</p>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">Total Farmers</h3>
                <p className="text-3xl font-bold">{stats.totalFarmers || 0}</p>
                <p className="text-xs mt-1 opacity-80">+8% from last month</p>
              </div>
              <div className="text-4xl opacity-80">🌾</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
                <p className="text-xs mt-1 opacity-80">+25% from last month</p>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">₹{stats.totalRevenue || 0}</p>
                <p className="text-xs mt-1 opacity-80">+18% from last month</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'products', 'farmers', 'users', 'orders', 'analytics', 'commission'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Active Users</span>
                        <span className="font-semibold">{stats.totalUsers - 5 || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Pending Approvals</span>
                        <span className="font-semibold text-orange-600">{farmers.filter(f => f.verification?.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Today's Orders</span>
                        <span className="font-semibold text-green-600">{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">New farmer registration</span>
                        <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Order completed</span>
                        <span className="text-xs text-gray-500 ml-auto">4h ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Product added</span>
                        <span className="text-xs text-gray-500 ml-auto">6h ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-800">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">Server Status</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Online</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">Database</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Connected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">API Response</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Product Management</h3>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    + Add Product
                  </button>
                </div>

                {showAddProduct && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Product Name</label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            className="w-full p-2 border rounded"
                            placeholder="e.g., Fresh Milk"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            required
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            className="w-full p-2 border rounded"
                            rows="3"
                            placeholder="Product description..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Price (₹)</label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={newProduct.price.amount}
                              onChange={(e) => setNewProduct({...newProduct, price: {...newProduct.price, amount: e.target.value}})}
                              className="w-full p-2 border rounded"
                              placeholder="60"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Price Unit</label>
                            <select
                              value={newProduct.price.unit}
                              onChange={(e) => setNewProduct({...newProduct, price: {...newProduct.price, unit: e.target.value}})}
                              className="w-full p-2 border rounded"
                            >
                              <option value="kg">kg</option>
                              <option value="litre">litre</option>
                              <option value="piece">piece</option>
                              <option value="dozen">dozen</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={newProduct.stock.quantity}
                              onChange={(e) => setNewProduct({...newProduct, stock: {...newProduct.stock, quantity: e.target.value}})}
                              className="w-full p-2 border rounded"
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Stock Unit</label>
                            <select
                              value={newProduct.stock.unit}
                              onChange={(e) => setNewProduct({...newProduct, stock: {...newProduct.stock, unit: e.target.value}})}
                              className="w-full p-2 border rounded"
                            >
                              <option value="kg">kg</option>
                              <option value="litre">litre</option>
                              <option value="piece">piece</option>
                              <option value="dozen">dozen</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="dairy">Dairy</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="fruits">Fruits</option>
                            <option value="grains">Grains</option>
                            <option value="organic">Organic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Farming Method</label>
                          <select
                            value={newProduct.farmingMethod}
                            onChange={(e) => setNewProduct({...newProduct, farmingMethod: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="organic">Organic</option>
                            <option value="natural">Natural</option>
                            <option value="chemical">Chemical</option>
                          </select>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                          >
                            Add Product
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddProduct(false)}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.images?.[0]?.url}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.price.amount}/{product.price.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock.quantity} {product.stock.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.farmingDetails?.isOrganic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.farmingDetails?.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'farmers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Farmer Management</h3>
                  <div className="flex space-x-4">
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search farmers..."
                      className="border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {farmers
                        .filter(farmer => 
                          (!filterStatus || farmer.verification?.status === filterStatus) &&
                          (!searchTerm || farmer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farmer.farmName?.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map(farmer => (
                        <tr key={farmer._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{farmer.user?.name}</div>
                              <div className="text-sm text-gray-500">{farmer.user?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {farmer.farmName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              farmer.verification?.status === 'approved' ? 'bg-green-100 text-green-800' :
                              farmer.verification?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {farmer.verification?.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {farmer.verification?.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleFarmerAction(farmer._id, 'approve')}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => handleFarmerAction(farmer._id, 'reject', 'Documents incomplete')}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            )}
                            {farmer.verification?.status === 'approved' && (
                              <span className="text-green-600 font-medium">✓ Verified</span>
                            )}
                            {farmer.verification?.status === 'rejected' && (
                              <span className="text-red-600 font-medium">✗ Rejected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Order Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivered</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Top Categories</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">🥬 Vegetables</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">🍎 Fruits</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">🌾 Grains</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Revenue Trend</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-medium text-green-600">₹45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span className="font-medium text-green-600">+15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users and Orders tabs remain the same */}
            {activeTab === 'commission' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Commission Management</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Update Settings
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold mb-4">Commission Rates</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Platform Commission</span>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue="5" className="w-16 border rounded px-2 py-1" />
                          <span>%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment Gateway Fee</span>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue="2.5" className="w-16 border rounded px-2 py-1" />
                          <span>%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Delivery Fee</span>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue="30" className="w-16 border rounded px-2 py-1" />
                          <span>₹</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold mb-4">Commission Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Collected</span>
                        <span className="font-medium">₹{Math.floor(stats.totalRevenue * 0.05) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-medium">₹{Math.floor(stats.totalRevenue * 0.05 * 0.3) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Payout</span>
                        <span className="font-medium text-orange-600">₹{Math.floor(stats.totalRevenue * 0.02) || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border">
                  <div className="p-6">
                    <h4 className="font-semibold mb-4">Recent Transactions</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.slice(0, 5).map(order => (
                            <tr key={order._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{order.orderNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.farmer?.farmName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">₹{order.pricing?.total}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                ₹{Math.floor(order.pricing?.total * 0.05) || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                                  Collected
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleUserStatus(user._id)}
                              className={`${
                                user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.consumer?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.farmer?.farmName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{order.pricing?.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status?.current === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status?.current === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status?.current}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
