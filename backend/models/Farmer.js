const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: true
  },
  farmLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    pincode: {
      type: String,
      required: true
    }
  },
  farmingMethod: {
    type: String,
    enum: ['organic', 'natural', 'chemical'],
    required: true
  },
  cropTypes: [{
    type: String,
    required: true
  }],
  deliveryRadius: {
    type: Number,
    default: 10, // km
    min: 1,
    max: 50
  },
  documents: {
    aadhaar: {
      number: String,
      imageUrl: String
    },
    govtId: {
      type: String,
      imageUrl: String
    }
  },
  farmImages: [{
    url: String,
    caption: String
  }],
  verification: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    withdrawn: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for location-based queries
farmerSchema.index({ 'farmLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Farmer', farmerSchema);