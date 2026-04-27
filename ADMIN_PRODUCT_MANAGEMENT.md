# ADMIN PRODUCT MANAGEMENT - COMPLETE GUIDE

## ✅ FEATURES IMPLEMENTED

### Backend API Routes:

#### Admin Product Routes (in `/api/admin/products`):
1. **GET /api/admin/products** - Get all products with pagination
2. **POST /api/admin/products** - Add new product
3. **PUT /api/admin/products/:id/toggle-status** - Activate/Deactivate product
4. **DELETE /api/admin/products/:id** - Delete product permanently

#### General Product Routes (in `/api/products`):
1. **GET /api/products** - Get all ACTIVE products (public)
2. **GET /api/products/:id** - Get product details
3. **PUT /api/products/:id** - Update product (Admin/Farmer)
4. **DELETE /api/products/:id** - Delete product (Admin/Farmer)

### Frontend (Admin Dashboard):

**Products Tab** includes:
- ✅ View all products in table format
- ✅ Add new product button with modal form
- ✅ Delete product button for each product
- ✅ Product details (name, price, stock, farming method)
- ✅ Product images display

---

## 🎯 HOW IT WORKS

### 1. Only ACTIVE Products Show to Consumers

```javascript
// In GET /api/products route
query = {
  isActive: true,  // Only active products
  'availability.isAvailable': true,
  'stock.quantity': { $gt: 0 }
};
```

### 2. Admin Can Control Product Visibility

**Option 1: Toggle Status (Soft Delete)**
```javascript
// Makes product inactive but keeps in database
PUT /api/admin/products/:id/toggle-status
```

**Option 2: Permanent Delete**
```javascript
// Removes product from database completely
DELETE /api/admin/products/:id
```

---

## 🚀 HOW TO USE (Admin Panel)

### Step 1: Login as Admin
```
Email: admin@kshirva.com
Password: admin123
```

### Step 2: Go to Products Tab
- Click on "Products" tab in admin dashboard
- You'll see all products in a table

### Step 3: Add New Product
1. Click "+ Add Product" button
2. Fill in the form:
   - Product Name
   - Description
   - Price
   - Stock Quantity
   - Farming Method (Organic/Natural)
3. Click "Add Product"

### Step 4: Delete Product
- Click "Delete" button next to any product
- Confirm deletion
- Product will be removed from database

---

## 📝 PRODUCT VISIBILITY RULES

### Products WILL SHOW to consumers if:
- ✅ `isActive: true`
- ✅ `availability.isAvailable: true`
- ✅ `stock.quantity > 0`

### Products WON'T SHOW to consumers if:
- ❌ `isActive: false` (deactivated by admin)
- ❌ `availability.isAvailable: false`
- ❌ `stock.quantity = 0` (out of stock)
- ❌ Product deleted from database

---

## 🔧 API EXAMPLES

### Add Product (Admin):
```bash
POST http://localhost:5000/api/admin/products
Headers: Authorization: Bearer <admin_token>
Body:
{
  "farmer": "farmer_id_here",
  "name": "Fresh Organic Milk",
  "description": "Pure organic milk",
  "category": "dairy",
  "subcategory": "milk",
  "price": { "amount": 60, "unit": "litre" },
  "stock": { "quantity": 100, "unit": "litre" },
  "farmingDetails": { "method": "organic", "isOrganic": true },
  "images": [{ "url": "image_url_here" }]
}
```

### Delete Product (Admin):
```bash
DELETE http://localhost:5000/api/admin/products/:productId
Headers: Authorization: Bearer <admin_token>
```

### Toggle Product Status (Admin):
```bash
PUT http://localhost:5000/api/admin/products/:productId/toggle-status
Headers: Authorization: Bearer <admin_token>
```

---

## 🎨 FRONTEND IMPLEMENTATION

### Admin Dashboard Component:
File: `frontend/src/pages/admin/Dashboard.js`

**Features:**
- Products tab with table view
- Add product modal form
- Delete confirmation
- Real-time updates after add/delete

**Key Functions:**
```javascript
handleAddProduct()     // Adds new product
handleDeleteProduct()  // Deletes product
fetchDashboardData()   // Refreshes product list
```

---

## ✅ TESTING

### Backend Server Must Be Running:
```bash
cd backend
npm start
```

### Frontend Must Be Running:
```bash
cd frontend
npm start
```

### Test Flow:
1. Login as admin: http://localhost:3000/login
2. Go to admin dashboard: http://localhost:3000/admin/dashboard
3. Click "Products" tab
4. Try adding a product
5. Try deleting a product
6. Check consumer view - deleted products won't show

---

## 🔒 PERMISSIONS

| Action | Admin | Farmer | Consumer |
|--------|-------|--------|----------|
| View all products | ✅ | ❌ | ✅ (active only) |
| Add product | ✅ | ✅ (own) | ❌ |
| Edit product | ✅ | ✅ (own) | ❌ |
| Delete product | ✅ | ✅ (own) | ❌ |
| Toggle status | ✅ | ❌ | ❌ |

---

## 📊 DATABASE SCHEMA

```javascript
Product {
  farmer: ObjectId,
  name: String,
  description: String,
  category: String,
  price: { amount: Number, unit: String },
  stock: { quantity: Number, unit: String },
  isActive: Boolean,  // ← Controls visibility
  availability: {
    isAvailable: Boolean  // ← Controls availability
  },
  farmingDetails: {
    method: String,
    isOrganic: Boolean
  }
}
```

---

## 🎯 SUMMARY

✅ **Admin can add products** - Through admin panel
✅ **Admin can delete products** - Permanently removes from DB
✅ **Only active products show** - Consumers see only `isActive: true`
✅ **Frontend ready** - Admin dashboard has full UI
✅ **Backend ready** - All API routes implemented
✅ **Permissions set** - Role-based access control

**Next Steps:**
1. Start both servers
2. Login as admin
3. Go to Products tab
4. Test add/delete functionality
5. Verify consumer view shows only active products
