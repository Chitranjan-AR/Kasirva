import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    subcategory: '',
    price: { amount: '', unit: 'kg' },
    stock: { quantity: '', unit: 'kg' },
    farmingMethod: 'natural'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products/farmer/my-products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newProduct,
          farmingDetails: { method: newProduct.farmingMethod, isOrganic: newProduct.farmingMethod === 'organic' },
          freshness: { harvestDate: new Date() }
        })
      });

      if (response.ok) {
        toast.success('Product added successfully!');
        setShowAddForm(false);
        setNewProduct({
          name: '', description: '', category: 'vegetables', subcategory: '',
          price: { amount: '', unit: 'kg' }, stock: { quantity: '', unit: 'kg' },
          farmingMethod: 'natural'
        });
        fetchProducts();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add product');
      }
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewProduct(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setNewProduct(prev => ({ ...prev, [field]: value }));
    }
  };

  const categories = {
    vegetables: ['fresh vegetables', 'leafy greens', 'root vegetables'],
    fruits: ['seasonal fruits', 'citrus fruits', 'berries'],
    grains: ['cereals', 'pulses', 'millets'],
    dairy: ['milk', 'cheese', 'eggs'],
    organic: ['spices', 'oils', 'honey']
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
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="input-field"
                      required
                    >
                      {Object.keys(categories).map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory *
                    </label>
                    <select
                      value={newProduct.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {categories[newProduct.category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Farming Method *
                    </label>
                    <select
                      value={newProduct.farmingMethod}
                      onChange={(e) => handleInputChange('farmingMethod', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="organic">Organic</option>
                      <option value="natural">Natural</option>
                      <option value="chemical">Chemical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={newProduct.price.amount}
                        onChange={(e) => handleInputChange('price.amount', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Amount"
                        required
                      />
                      <select
                        value={newProduct.price.unit}
                        onChange={(e) => handleInputChange('price.unit', e.target.value)}
                        className="input-field w-24"
                      >
                        <option value="kg">kg</option>
                        <option value="gm">gm</option>
                        <option value="litre">litre</option>
                        <option value="piece">piece</option>
                        <option value="dozen">dozen</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={newProduct.stock.quantity}
                        onChange={(e) => handleInputChange('stock.quantity', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Quantity"
                        required
                      />
                      <select
                        value={newProduct.stock.unit}
                        onChange={(e) => handleInputChange('stock.unit', e.target.value)}
                        className="input-field w-24"
                      >
                        <option value="kg">kg</option>
                        <option value="gm">gm</option>
                        <option value="litre">litre</option>
                        <option value="piece">piece</option>
                        <option value="dozen">dozen</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Product'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price?.amount}/{product.price?.unit}
                    </span>
                    {product.farmingDetails?.isOrganic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Organic
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock?.quantity} {product.stock?.unit}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300 transition-colors">
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No products yet</h2>
            <p className="text-gray-600 mb-8">Start by adding your first product to the marketplace</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;