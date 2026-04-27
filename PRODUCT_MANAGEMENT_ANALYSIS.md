# Backend Product Management Analysis

## 1. Product Schema/Model Structure

### Location: [backend/models/Product.js](backend/models/Product.js)

The Product model defines the complete structure for managing agricultural products on the platform:

```javascript
// CORE FIELDS
{
  farmer: ObjectId (ref: Farmer) - REQUIRED - Links product to farmer
  name: String - REQUIRED - Product name
  description: String - REQUIRED - Product description
  
  // CATEGORIZATION
  category: String - REQUIRED
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'organic']
  
  subcategory: String - OPTIONAL
    Examples in dairy: 'fresh-milk', 'flavored-milk', 'butter-cream', 
                      'paneer-cheese', 'ghee', 'curd-dahi', 'drinks'
  
  // PRICING & UNITS
  price: {
    amount: Number - REQUIRED (min: 0)
    unit: String - REQUIRED
      enum: ['kg', 'gm', 'litre', 'ml', 'piece', 'dozen']
  }
  
  // STOCK MANAGEMENT
  stock: {
    quantity: Number - REQUIRED (min: 0)
    unit: String - REQUIRED enum: ['kg', 'gm', 'litre', 'ml', 'piece', 'dozen']
    lowStockThreshold: Number - default: 5
  }
  
  // IMAGES/MEDIA
  images: [{
    url: String - default: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500'
    alt: String
  }]
  
  // FRESHNESS DATA
  freshness: {
    harvestDate: Date - OPTIONAL (default: Date.now)
    expiryDate: Date
    freshnessScore: Number - min: 0, max: 100, default: 95
      * AUTO-CALCULATED on save:
        - Days since harvest = (now - harvestDate) / (24 hours)
        - freshnessScore = max(0, 100 - (daysSinceHarvest * 10))
  }
  
  // FARMING DETAILS
  farmingDetails: {
    method: String - REQUIRED
      enum: ['organic', 'natural', 'chemical']
    
    isOrganic: Boolean - default: false
    
    organicCertification: {
      certified: Boolean
      certificationBody: String
      certificateUrl: String
    }
  }
  
  // AVAILABILITY
  availability: {
    isAvailable: Boolean - default: true
    seasonal: {
      isSeasonal: Boolean
      season: String
      availableMonths: [Number] - array of month numbers
    }
  }
  
  // RATINGS
  rating: {
    average: Number - default: 0, min: 0, max: 5
    count: Number - default: 0 (number of ratings)
  }
  
  // METADATA
  tags: [String] - searchable tags
  isActive: Boolean - default: true
  timestamps: true - createdAt, updatedAt
}
```

---

## 2. Current Product Categories & Types

### Available Categories (Enums)
```
['vegetables', 'fruits', 'grains', 'dairy', 'organic']
```

### Dairy Subcategories (Most Populated)
The system currently focuses heavily on **dairy products** with these subcategories:

#### **Fresh Milk**
- Cow Milk (Full Cream) - ₹60/litre
- Cow Milk (Toned) - ₹50/litre
- Buffalo Milk - ₹70/litre
- Organic Milk - ₹80/litre
- A2 Desi Milk - ₹90/litre
- Lactose Free Milk - ₹85/litre
- Skimmed Milk - ₹55/litre
- Raw Farm Fresh Milk - ₹65/litre
- Goat Milk - ₹100/litre
- Camel Milk - ₹150/litre

#### **Flavored Milk**
- Chocolate Milk - ₹70/litre
- Strawberry Milk - ₹70/litre
- Mango Milk - ₹75/litre
- Badam Milk - ₹80/litre
- Turmeric Milk (Haldi) - ₹65/litre
- Rose Milk - ₹65/litre

#### **Butter & Cream**
- White Butter (Makhan) - ₹400/kg
- Salted Butter - ₹450/kg
- Unsalted Butter - ₹450/kg
- Fresh Cream - ₹300/kg
- Whipping Cream - ₹350/kg
- Malai (Milk Cream) - ₹280/kg
- Clotted Cream - ₹380/kg

#### **Paneer & Cheese**
- Fresh Paneer - ₹350/kg
- Malai Paneer - ₹400/kg
- Smoked Paneer - ₹420/kg
- Mozzarella Cheese - ₹500/kg
- Cheddar Cheese - ₹480/kg
- Cheese Slices - ₹200/piece
- Ricotta Cheese - ₹460/kg

#### **Ghee**
- Cow Ghee - ₹600/kg
- Buffalo Ghee - ₹650/kg
- A2 Ghee (Desi Cow) - ₹800/kg
- Bilona Ghee - ₹900/kg
- Desi Ghee - ₹700/kg
- Organic Ghee - ₹850/kg

#### **Curd & Dahi**
- Fresh Dahi (Curd) - ₹60/kg
- Mishti Doi - ₹80/kg
- Greek Yogurt - ₹120/kg
- Hung Curd (Chakka) - ₹100/kg
- Probiotic Dahi - ₹90/kg

#### **Drinks & Desserts**
- Buttermilk (Chaas) - ₹40/litre
- Sweet Lassi - ₹50/litre
- Salted Lassi - ₹50/litre
- Mango Lassi - ₹70/litre
- Rose Lassi - ₹65/litre
- Shrikhand - ₹180/kg
- Rabri - ₹200/kg
- Kheer Mix - ₹150/kg

---

## 3. Seed & Fixture Files

### [backend/utils/seedDatabase.js](backend/utils/seedDatabase.js)
**Purpose**: Main database initialization script
- Creates sample users (admin, farmer, consumer)
- Creates farmer profile with farm details
- Seeds 8 dairy products (milk variations) as starting dataset
- Clears and resets entire database

**Sample Products Data Structure**:
```javascript
{
  name: 'Fresh Cow Milk',
  description: 'Pure, fresh cow milk from grass-fed cows...',
  category: 'dairy',
  price: { amount: 60, unit: 'litre' },
  stock: { quantity: 50, unit: 'liters' },
  images: [{ url: 'unsplash image url' }],
  farmingDetails: { method: 'organic', isOrganic: true },
  freshness: { harvestDate: new Date(), freshnessScore: 95 },
  rating: { average: 4.8, count: 45 }
}
```

### [backend/seedDairyProducts.js](backend/seedDairyProducts.js)
**Purpose**: Comprehensive dairy product seeding (47 products)
- Focuses exclusively on dairy category
- Organizes products by 7 subcategories
- Creates fresh, realistic product variations
- Auto-generates random ratings (4.0-5.0) and review counts

**Key Features**:
- Connects to MongoDB directly
- Clears only dairy products
- Uses first available farmer
- Adds timestamps automatically
- Sets `isActive: true` on all products

**Simplified Data Format Used**:
```javascript
{
  name: 'Cow Milk (Full Cream)',
  subcategory: 'fresh-milk',
  price: 60,
  unit: 'litre',
  stock: 100,
  desc: 'Fresh full cream cow milk, rich in nutrients...',
  img: 'https://images.unsplash.com/photo-...'
}
```

### [backend/fixProducts.js](backend/fixProducts.js)
**Purpose**: Maintenance script for product consistency
- Ensures all products have farmer reference
- Creates farmer if missing
- Updates all products with timestamps
- Validates farmer relationships

**Usage**: Run before seeding if products are orphaned

### Other Scripts
- **[addFields.js](backend/addFields.js)** - Adds/updates fields dynamically
- **[fixProductsFarmer.js](backend/fixProductsFarmer.js)** - Version of fixProducts
- **[updateProducts.js](backend/updateProducts.js)** - Bulk updates products

---

## 4. How Products Are Stored & Categorized

### Storage Structure
```
MongoDB Collection: "products"
├── farmer: ObjectId → references Farmer document
├── category: 'dairy', 'vegetables', 'fruits', 'grains', 'organic'
├── subcategory: specific type within category
├── Active Status: isActive = true, availability.isAvailable = true
└── Stock Check: stock.quantity > 0
```

### Query Conditions for Active Products
Products appear in catalog when ALL conditions met:
```javascript
{
  isActive: true,
  'availability.isAvailable': true,
  'stock.quantity': { $gt: 0 }
}
```

### Data Organization Process

**1. Farming Method Classification**
```
method: ['organic', 'natural', 'chemical']
- Affects product filtering and premium pricing
- Organic certification optional but tracked
```

**2. Stock Management**
```javascript
stock: {
  quantity: 100,
  unit: 'litre',
  lowStockThreshold: 10  // triggers inventory alerts
}
```

**3. Freshness Tracking**
- Auto-calculated based on harvest date
- Decreases 10 points per day
- Shows product freshness to consumers

**4. Farmer Association**
- Every product linked to specific farmer
- Enables farmer-specific product listing
- Tracks which farmer provides what

---

## 5. Product Listing Endpoints

### API Routes: [backend/routes/products.js](backend/routes/products.js)

#### **1. Get All Products (Public)**
```
GET /api/products
PARAMETERS:
  - category: filter by category ['vegetables', 'fruits', 'grains', 'dairy', 'organic']
  - subcategory: filter by subcategory
  - farmingMethod: filter by ['organic', 'natural', 'chemical']
  - minPrice / maxPrice: price range filtering
  - search: text search on name, description, tags
  - lat / lng / radius: location-based search (10km default)
  - page: pagination (default: 1)
  - limit: items per page (default: 12)
  - sortBy: field to sort (default: 'createdAt')
  - sortOrder: 'asc' or 'desc' (default: 'desc')

RESPONSE:
  - Products array with:
    - Basic product details
    - Farmer info (populated: farmName, rating, verification)
    - Farmer user info (populated: name)
  - Pagination metadata

FILTERS APPLIED:
  - Only active products (isActive: true)
  - Only available products (availability.isAvailable: true)
  - Only in-stock products (stock.quantity > 0)
```

#### **2. Get Farmer's Products (Private - Farmer)**
```
GET /api/products/farmer/my-products
AUTHENTICATION: Required (Farmer role only)

RESPONSE:
  - All products belonging to authenticated farmer
  - Sorted by newest first (createdAt: -1)
  - No filtering - includes inactive/unavailable products
```

---

## 6. Product Fields & Data Types Summary

### Complete Field Reference

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| farmer | ObjectId | ✓ | - | Reference to Farmer |
| name | String | ✓ | - | Product name |
| description | String | ✓ | - | Product details |
| category | Enum | ✓ | - | 5 main categories |
| subcategory | String | - | - | Sub-type within category |
| price.amount | Number | ✓ | - | Cost per unit |
| price.unit | Enum | ✓ | - | kg, gm, litre, ml, piece, dozen |
| stock.quantity | Number | ✓ | - | Available quantity |
| stock.unit | Enum | ✓ | - | Matches price unit |
| stock.lowStockThreshold | Number | - | 5 | Alert threshold |
| images[].url | String | - | unsplash URL | Product image |
| images[].alt | String | - | - | Image alt text |
| freshness.harvestDate | Date | - | Date.now | When picked/produced |
| freshness.expiryDate | Date | - | - | Expiry date |
| freshness.freshnessScore | Number | - | 95 | Auto-calculated (0-100) |
| farmingDetails.method | Enum | ✓ | - | organic/natural/chemical |
| farmingDetails.isOrganic | Boolean | - | false | Organic flag |
| farmingDetails.organicCertification | Object | - | - | Cert details |
| availability.isAvailable | Boolean | - | true | Active in catalog |
| availability.seasonal | Object | - | - | Seasonal info |
| rating.average | Number | - | 0 | Average rating (0-5) |
| rating.count | Number | - | 0 | Number of ratings |
| tags | Array | - | [] | Searchable keywords |
| isActive | Boolean | - | true | Admin control flag |
| timestamps | - | ✓ | - | createdAt, updatedAt |

---

## 7. Key Insights

### Current System State
✅ **Strong Foundation**
- Well-defined product schema with all necessary fields
- Comprehensive dairy product catalog (47 products seeded)
- Proper farmer association and verification
- Full-text search capability
- Location-based filtering
- Freshness tracking system

⚠️ **Observations**
- Mostly dairy-focused (other categories under-utilized)
- Freshness score calculation is simple (linear decay)
- Limited subcategories for non-dairy products
- Admin product management routes may need expansion

### Data Flow
```
Database Seed (seedDairyProducts.js)
    ↓
Product Documents Stored
    ↓
Public API (/api/products) - Filtered for active/available
           Farmer API (/api/products/farmer/my-products) - All farmer products
           Admin Dashboard - Statistics
    ↓
Frontend Display with Search/Filter/Sort
```

### Scalability Notes
- Text indexes exist for search optimization
- Category and price indexes for fast filtering
- Stock and rating indexes for sorting
- Location index for geo-queries
- **Schema supports expansion** for additional product types
