# Kshirva - Local Farm-to-Consumer Marketplace

A comprehensive MERN stack application connecting farmers directly with consumers for fresh produce delivery.

## 🌟 Features

### For Consumers
- Browse fresh produce from local farmers
- Location-based farmer discovery
- Real-time order tracking
- Secure online payments
- Rating and review system
- Cart and wishlist functionality

### For Farmers
- Complete farmer profile with verification
- Product inventory management
- Order management dashboard
- Earnings tracking
- Direct communication with customers
- Document upload for verification

### For Admins
- Farmer verification and approval
- User management
- Order monitoring
- Analytics dashboard
- Commission management

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- Tailwind CSS
- React Router DOM
- React Query
- Socket.io Client
- React Hook Form

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Cloudinary (Image Storage)
- Twilio (SMS)
- Nodemailer (Email)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- Twilio account (for SMS)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Kshirva
```

2. **Install dependencies**
```bash
npm run install-deps
```

3. **Environment Setup**

Backend (.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kshirva
CLIENT_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. **Start the application**
```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

## 📁 Project Structure

```
Kashirva/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
└── shared/              # Shared utilities
```

## 🔐 Authentication & Authorization

The app uses JWT-based authentication with role-based access control:
- **Consumer**: Can browse products, place orders, track deliveries
- **Farmer**: Can manage products, handle orders, view earnings
- **Admin**: Can manage users, verify farmers, monitor platform

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Can be installed as PWA

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- File upload restrictions

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy using Git or GitHub integration

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the build folder

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-otp` - Verify phone number

### Product Endpoints
- `GET /api/products` - Get all products with filters
- `POST /api/products` - Create new product (Farmer)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (Farmer)

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@kshirva.com or create an issue in the repository.