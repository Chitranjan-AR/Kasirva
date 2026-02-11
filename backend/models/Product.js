const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'organic'],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'gm', 'litre', 'ml', 'piece', 'dozen'],
      required: true
    }
  },
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'gm', 'litre', 'ml', 'piece', 'dozen'],
      required: true
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    }
  },
  freshness: {
    harvestDate: {
      type: Date,
      required: true
    },
    expiryDate: Date,
    freshnessScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  farmingDetails: {
    method: {
      type: String,
      enum: ['organic', 'natural', 'chemical'],
      required: true
    },
    isOrganic: {
      type: Boolean,
      default: false
    },
    organicCertification: {
      certified: Boolean,
      certificationBody: String,
      certificateUrl: String
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    seasonal: {
      isseasonal: Boolean,
      season: String,
      availableMonths: [Number]
    }
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
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate freshness score based on harvest date
productSchema.pre('save', function(next) {
  if (this.freshness.harvestDate) {
    const daysSinceHarvest = Math.floor((Date.now() - this.freshness.harvestDate) / (1000 * 60 * 60 * 24));
    this.freshness.freshnessScore = Math.max(0, 100 - (daysSinceHarvest * 10));
  }
  next();
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ 'price.amount': 1 });
productSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Product', productSchema);