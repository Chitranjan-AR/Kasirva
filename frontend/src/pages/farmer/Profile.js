import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    farmName: '',
    farmLocation: {
      address: '',
      coordinates: { lat: '', lng: '' },
      pincode: ''
    },
    farmingMethod: 'natural',
    cropTypes: [],
    deliveryRadius: 10,
    documents: {
      aadhaar: { number: '', imageUrl: '' },
      govtId: { type: '', imageUrl: '' }
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/farmers/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/farmers/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCropTypeChange = (crop, checked) => {
    setProfile(prev => ({
      ...prev,
      cropTypes: checked 
        ? [...prev.cropTypes, crop]
        : prev.cropTypes.filter(c => c !== crop)
    }));
  };

  const cropOptions = ['vegetables', 'fruits', 'grains', 'dairy', 'organic'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Farmer Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Name *
                </label>
                <input
                  type="text"
                  value={profile.farmName}
                  onChange={(e) => handleInputChange(null, 'farmName', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farming Method *
                </label>
                <select
                  value={profile.farmingMethod}
                  onChange={(e) => handleInputChange(null, 'farmingMethod', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="organic">Organic</option>
                  <option value="natural">Natural</option>
                  <option value="chemical">Chemical</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Types *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {cropOptions.map(crop => (
                  <label key={crop} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.cropTypes.includes(crop)}
                      onChange={(e) => handleCropTypeChange(crop, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="capitalize">{crop}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Location */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Farm Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Address *
                </label>
                <textarea
                  value={profile.farmLocation.address}
                  onChange={(e) => handleInputChange('farmLocation', 'address', e.target.value)}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={profile.farmLocation.pincode}
                    onChange={(e) => handleInputChange('farmLocation', 'pincode', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={profile.farmLocation.coordinates.lat}
                    onChange={(e) => handleInputChange('farmLocation', 'coordinates', 
                      { ...profile.farmLocation.coordinates, lat: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={profile.farmLocation.coordinates.lng}
                    onChange={(e) => handleInputChange('farmLocation', 'coordinates', 
                      { ...profile.farmLocation.coordinates, lng: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={profile.deliveryRadius}
                  onChange={(e) => handleInputChange(null, 'deliveryRadius', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  value={profile.documents?.aadhaar?.number || ''}
                  onChange={(e) => handleInputChange('documents', 'aadhaar', 
                    { ...profile.documents?.aadhaar, number: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID Type
                </label>
                <select
                  value={profile.documents?.govtId?.type || ''}
                  onChange={(e) => handleInputChange('documents', 'govtId', 
                    { ...profile.documents?.govtId, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select ID Type</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="driving_license">Driving License</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={profile.bankDetails?.accountHolderName || ''}
                  onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={profile.bankDetails?.bankName || ''}
                  onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={profile.bankDetails?.accountNumber || ''}
                  onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={profile.bankDetails?.ifscCode || ''}
                  onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;