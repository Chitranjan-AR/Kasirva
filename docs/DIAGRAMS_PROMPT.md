# Kshirva – Diagram Generation Prompts

Copy any section below and paste it into an AI (ChatGPT, Claude, Gemini, etc.) to generate the exact diagram for this project.

---

## HOW TO USE

- Each section has a **"COPY THIS PROMPT"** block.
- Paste it into any AI tool.
- Specify the output format you want: **Mermaid**, **PlantUML**, **draw.io XML**, **Lucidchart**, or **plain image description**.

---

---

## 1. COMPONENT (CO) DIAGRAM PROMPT

```
Generate a Component Diagram for a MERN stack web application called "Kshirva" — a farm-to-consumer marketplace.

Use the following EXACT project structure:

FRONTEND (React.js, port 3000):
- App.js — root component, wraps everything in providers
- Providers/Contexts:
  - AuthContext (manages JWT token, user role: consumer / farmer / admin)
  - CartContext (manages cart items)
  - WishlistContext (manages wishlist)
  - NotificationContext (manages real-time notifications via Socket.io)
- Layout Components:
  - Navbar.js
  - Footer.js
- Auth Components:
  - ProtectedRoute.js (role-based route guard)
- Pages:
  - Public: Home, Login, Register, VerifyOTP, ProductCatalog, ProductDetails, AboutUs, Contact, Farmers, HelpCenter, TermsOfService, PrivacyPolicy, FAQ
  - Consumer (protected): Dashboard, Cart, Checkout, OrderTracking, MyOrders, Wishlist
  - Farmer (protected): Dashboard, ProductManagement, Profile, InventoryManagement
  - Admin (protected): Dashboard
- Services:
  - api.js (Axios instance with JWT interceptor, auto-redirect on 401)
  - APIs: authAPI, farmerAPI, productAPI, userAPI, orderAPI, paymentAPI, adminAPI
- Utils:
  - pwa.js (PWA service worker registration)

BACKEND (Node.js + Express.js, port 5000):
- server.js — entry point
  - Middleware: helmet, cors, express-rate-limit (100 req/15min), express.json
  - Socket.io server (real-time: new_order, order_update events)
  - MongoDB connection via Mongoose
- Routes (all prefixed /api/):
  - /auth — register, login, verify-otp, resend-otp, me
  - /users — profile, addresses (CRUD), set default address
  - /farmers — profile (create/update), dashboard, nearby (geo-query), upload-documents
  - /products — CRUD, farmer products, upload images
  - /orders — create, list, get by ID, update status, cancel, review
  - /payments — create Razorpay order, verify payment
  - /admin — dashboard, farmer approval/rejection, user management, product management
  - /notifications — notification list
  - /chat — order chat messages
  - /subscriptions — subscription management
- Middleware:
  - auth.js — JWT verification, role-based authorize()
  - upload.js — Multer file upload handler
- Models (MongoDB/Mongoose):
  - User — name, email, phone, password (bcrypt), role (consumer/farmer/admin), address, savedAddresses[], isVerified, otp, preferences
  - Farmer — ref:User, farmName, farmLocation (GeoJSON Point, 2dsphere index), farmingMethod, cropTypes[], deliveryRadius, documents (aadhaar, govtId), verification (pending/approved/rejected), rating, earnings, bankDetails
  - Product — ref:Farmer, name, description, category (vegetables/fruits/grains/dairy/organic), images[], price (amount, unit), stock (quantity, unit, lowStockThreshold), freshness (harvestDate, freshnessScore), farmingDetails (organic/natural/chemical), availability, rating, tags[]
  - Order — ref:User(consumer), ref:Farmer, items[{ref:Product, quantity, price, totalPrice}], pricing (subtotal, deliveryFee 5%, tax, total), delivery (address, method, slot), status (pending→accepted→preparing→ready→out_for_delivery→delivered / rejected / cancelled), payment (online/cod, razorpayOrderId, razorpayPaymentId), communication (chat messages), review (rating 1-5, comment), cancellation
  - Subscription — subscription plans
- Utils:
  - notifications.js — sendOTP (Twilio), sendEmail (Nodemailer), sendOrderNotification
  - seedDatabase.js

EXTERNAL SERVICES:
- MongoDB Atlas / Local (database)
- Cloudinary (product and farm image storage)
- Razorpay (payment gateway — create order + verify signature)
- Twilio (SMS OTP)
- Nodemailer + Gmail SMTP (email notifications)
- Google Maps API (location, nearby farmer search, delivery address)
- Socket.io (real-time order updates between farmer and consumer)

Show components as boxes, group them by layer (Frontend / Backend / Database / External), and draw arrows showing data flow and dependencies.
```

---

---

## 2. WORKFLOW DIAGRAM PROMPT

```
Generate a Workflow Diagram for "Kshirva" — a farm-to-consumer marketplace MERN app.

Show the complete workflow for all 3 user roles. Use the following EXACT flows:

--- CONSUMER WORKFLOW ---
1. Visit Home page (public)
2. Browse ProductCatalog (filter by category: vegetables/fruits/grains/dairy/organic, location, price)
3. View ProductDetails (freshness score, farmer info, reviews)
4. Register (name, email, phone, password, role=consumer) → OTP sent via Twilio SMS → VerifyOTP page
5. Login (email or phone + password) → JWT token stored in localStorage
6. Add to Cart (CartContext) or Wishlist (WishlistContext)
7. Checkout:
   - Select/add delivery address (savedAddresses[])
   - Choose payment: online (Razorpay) or COD
   - If online: Razorpay payment gateway → verify signature → order created
   - If COD: order created directly
8. Order placed → status = "pending"
9. Farmer notified via Socket.io (new_order event) + SMS/Email
10. Track order on OrderTracking page (real-time status via Socket.io: pending → accepted → preparing → ready → out_for_delivery → delivered)
11. After delivery: leave review (rating 1-5, comment) → updates Farmer.rating.average

--- FARMER WORKFLOW ---
1. Register (role=farmer) → OTP verify → Login
2. Create Farmer Profile (farmName, farmLocation GeoJSON, farmingMethod, cropTypes, deliveryRadius, upload Aadhaar + govtId via Multer → Cloudinary)
3. Verification status = "pending" → Admin reviews
4. After approval (status = "approved"): access Farmer Dashboard
5. Manage Products (ProductManagement page):
   - Create product: name, category, price, stock, harvestDate, farmingMethod, upload images → Cloudinary
   - freshnessScore auto-calculated: 100 - (daysSinceHarvest × 10)
   - Update/delete products, manage inventory (InventoryManagement component)
6. Receive new order notification (Socket.io new_order event + SMS)
7. Accept or Reject order (PUT /api/orders/:id/status)
8. Update order status: accepted → preparing → ready → out_for_delivery → delivered
9. Consumer notified at each step via Socket.io (order_update event) + SMS/Email
10. View earnings (Farmer.earnings: total, pending, withdrawn)

--- ADMIN WORKFLOW ---
1. Login (role=admin)
2. Admin Dashboard:
   - View pending farmer applications
   - Approve farmer (PUT /api/admin/farmers/:id/approve) → Farmer.verification.status = "approved"
   - Reject farmer with reason (PUT /api/admin/farmers/:id/reject)
   - Manage users (toggle active/inactive)
   - Manage products (create, toggle status, delete)
   - Monitor all orders
   - View platform analytics

Show each role as a separate swim lane. Show decision points (OTP valid?, payment success?, farmer approved?, stock available?, order cancellable?).
```

---

---

## 3. FLOWCHART PROMPT — Order Placement & Lifecycle

```
Generate a detailed Flowchart for the complete Order Placement and Lifecycle in "Kshirva" app.

Use these EXACT steps and decision points from the codebase:

START: Consumer is logged in (JWT token in localStorage)

STEP 1 — Add to Cart:
- Consumer browses ProductCatalog (/products)
- Selects product → ProductDetails (/products/:id)
- Clicks "Add to Cart" → CartContext stores item

STEP 2 — Checkout (/checkout):
- Consumer selects delivery address from savedAddresses[] or adds new one
- Selects payment method: "online" or "cod"

STEP 3 — Stock Validation (backend POST /api/orders):
- For each item: check Product.stock.quantity >= requested quantity
- If NO → return error "Insufficient stock"
- Check all items belong to same Farmer (single-farmer orders only)
- If NO → return error "All items must be from the same farmer"

STEP 4 — Pricing Calculation:
- subtotal = sum of (product.price.amount × quantity)
- deliveryFee = subtotal >= 500 ? 0 : 50
- tax = subtotal × 0.05
- total = subtotal + deliveryFee + tax

STEP 5 — Payment:
- If method = "online":
  - POST /api/payments/create-order → Razorpay creates order
  - Consumer pays on Razorpay UI
  - POST /api/payments/verify → verify Razorpay signature
  - If verification FAILS → show error, do NOT create order
  - If verification PASSES → proceed
- If method = "cod" → proceed directly

STEP 6 — Order Created:
- Order saved to MongoDB with status.current = "pending"
- Stock deducted: Product.stock.quantity -= quantity for each item
- Order number generated: "KSH" + timestamp + random 4 digits

STEP 7 — Notifications:
- Socket.io emits "new_order" event to Farmer's socket room (farmer.user._id)
- sendOrderNotification() → SMS via Twilio + Email via Nodemailer to farmer

STEP 8 — Farmer Action:
- Farmer sees order on Dashboard
- PUT /api/orders/:id/status
- If REJECTED:
  - status = "rejected"
  - Stock restored: Product.stock.quantity += quantity
  - Consumer notified (Socket.io "order_update" + SMS/Email)
  - If payment was online → refund initiated
  - END
- If ACCEPTED:
  - status = "accepted"
  - Consumer notified

STEP 9 — Order Progression (Farmer updates status):
- accepted → preparing → ready → out_for_delivery → delivered
- At each step: Socket.io emits "order_update" to Consumer's socket room
- Consumer sees live status on OrderTracking page (/orders/:id)

STEP 10 — Cancellation (Consumer):
- PUT /api/orders/:id/cancel
- Only allowed if status is "pending" or "accepted"
- If status is "preparing" or later → cannot cancel
- Stock restored on cancellation
- Cancellation reason saved

STEP 11 — Delivery & Review:
- status = "delivered"
- Consumer can POST /api/orders/:id/review (only once, only for delivered orders)
- rating: 1-5, comment (max 500 chars)
- Farmer.rating.average recalculated: (oldAvg × oldCount + newRating) / newCount

END
```

---

---

## 4. DATA FLOW DIAGRAM (DFD) PROMPT

```
Generate a Data Flow Diagram (DFD) for "Kshirva" — a MERN stack farm-to-consumer marketplace.

Use the following EXACT data entities, processes, and data stores from the codebase:

EXTERNAL ENTITIES (actors):
- Consumer (role: consumer)
- Farmer (role: farmer)
- Admin (role: admin)
- Razorpay (payment gateway)
- Twilio (SMS service)
- Nodemailer/Gmail (email service)
- Cloudinary (image storage)
- Google Maps (location service)

DATA STORES (MongoDB collections):
- DS1: Users (name, email, phone, password_hash, role, address, savedAddresses, isVerified, otp, preferences)
- DS2: Farmers (ref:User, farmName, farmLocation GeoJSON, farmingMethod, cropTypes, deliveryRadius, documents, verification_status, rating, earnings, bankDetails)
- DS3: Products (ref:Farmer, name, category, images, price, stock, freshness, farmingDetails, availability, rating, tags)
- DS4: Orders (ref:User consumer, ref:Farmer, items[], pricing, delivery, status_history[], payment, review, cancellation)
- DS5: Subscriptions

PROCESSES:

P1 — Authentication & Authorization:
- Input: name/email/phone/password/role from Consumer or Farmer
- Reads/Writes: DS1 (Users)
- Output: JWT token (30 days expiry) → stored in browser localStorage
- Sub-process: OTP generation (6-digit) → stored in User.otp → sent via Twilio SMS
- Sub-process: OTP verification → User.isVerified = true
- Middleware: auth.js verifies JWT on every protected request, authorize() checks role

P2 — Farmer Profile & Verification:
- Input: farmName, farmLocation (lat/lng), farmingMethod, cropTypes, deliveryRadius, Aadhaar image, govtId image from Farmer
- Reads/Writes: DS2 (Farmers)
- Image upload: Multer (upload.js) → Cloudinary → URL stored in DS2
- Output: Farmer profile with verification.status = "pending"
- Admin input: approve/reject decision
- Output: verification.status = "approved" or "rejected" → stored in DS2

P3 — Product Management:
- Input: product data (name, category, price, stock, harvestDate, images) from Farmer
- Reads/Writes: DS3 (Products)
- Image upload: Multer → Cloudinary → image URLs stored in DS3
- Auto-calculation: freshnessScore = 100 - (daysSinceHarvest × 10) on pre-save hook
- Output: product listing available to consumers
- Indexes: text search on name/description/tags, category, price, rating

P4 — Product Discovery:
- Input: search query, category filter, location (lat/lng/radius) from Consumer
- Reads: DS3 (Products), DS2 (Farmers — 2dsphere geo-query for nearby farmers)
- External: Google Maps API for location resolution
- Output: filtered product list with farmer info and freshness scores

P5 — Order Processing:
- Input: items[], delivery address, payment method from Consumer
- Reads: DS3 (Products — stock check), DS2 (Farmers)
- Writes: DS4 (Orders), DS3 (stock decrement)
- Validation: stock >= quantity, all items from same farmer
- Pricing: subtotal, deliveryFee (free if ≥₹500), tax (5%), total
- Output: Order with status="pending", orderNumber="KSH{timestamp}{random}"

P6 — Payment Processing:
- Input: order total from Consumer
- Sends: amount to Razorpay API → receives razorpayOrderId
- Input: razorpayPaymentId + razorpaySignature from Consumer after payment
- Verifies: HMAC signature
- Writes: DS4 (Order.payment.status = "completed", razorpayPaymentId, paidAt)
- Output: payment confirmation

P7 — Real-time Notifications:
- Trigger: order created, status changed
- Socket.io: emits "new_order" to Farmer's room (farmer.user._id)
- Socket.io: emits "order_update" to Consumer's room (consumer._id)
- Twilio: sends SMS to farmer phone on new order
- Nodemailer: sends email to farmer on new order
- Twilio + Nodemailer: sends SMS + email to consumer on each status change

P8 — Order Status Management:
- Input: new status from Farmer (accepted/rejected/preparing/ready/out_for_delivery/delivered)
- Reads/Writes: DS4 (Orders — status.current + status.history[])
- If rejected: DS3 stock restored
- Output: updated order + real-time notification to consumer

P9 — Review System:
- Input: rating (1-5), comment (max 500 chars) from Consumer
- Condition: order.status.current must be "delivered", not already reviewed
- Writes: DS4 (Order.review), DS2 (Farmer.rating.average recalculated, Farmer.rating.count++)
- Formula: newAvg = (oldAvg × oldCount + newRating) / newCount

P10 — Admin Management:
- Input: admin decisions
- Reads: DS1, DS2, DS3, DS4
- Writes: DS2 (farmer verification), DS1 (user active/inactive toggle), DS3 (product status)
- Output: platform analytics, farmer approval/rejection

Draw Level 0 (context diagram showing all external entities and the system) and Level 1 (showing all 10 processes with data flows between them and the data stores).
```

---

---

## TIPS FOR BEST RESULTS

- For **Mermaid diagrams** (renders in GitHub/VS Code): add "Output as Mermaid code" to the prompt.
- For **draw.io**: add "Output as draw.io XML" to the prompt.
- For **PlantUML**: add "Output as PlantUML code" to the prompt.
- For **image/visual**: add "Generate as a visual diagram image" to the prompt.
- For **Lucidchart**: add "Describe the diagram in Lucidchart-compatible format" to the prompt.
