# 🛒 E-Commerce Application

A full-stack e-commerce application built with React.js, Node.js, and MongoDB, featuring AWS S3 storage, AWS Personalize for AI-powered recommendations, complete monitoring with Prometheus and Grafana, and comprehensive pagination support.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [AWS Services](#aws-services)
- [Monitoring](#monitoring)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Core E-Commerce Features
- 🛍️ **E-commerce Frontend**: Product catalog with pagination (36 items/page), shopping cart, user authentication
- ⚙️ **Admin Panel**: Product management with pagination (10 items/page), order tracking, user management
- 🔐 **Authentication**: JWT-based secure authentication for users and admins
- 💳 **Payment Integration**: Stripe and Razorpay payment gateways with COD support
- 📦 **Order Management**: Complete order lifecycle management with multiple payment methods

### AWS Integration
- ☁️ **AWS S3**: Secure cloud storage for product images with CDN support
- 🤖 **AWS Personalize**: AI-powered personalized product recommendations
  - "Recommended For You" on homepage
  - Related products on product pages
  - Event tracking (views, cart adds, purchases)
  - Smart fallback to bestsellers
- 🖼️ **Image Management**: Automatic Content-Type setting, Cache-Control, and optional public-read ACL

### Technical Features
- 📄 **Pagination**: Efficient data loading with customizable page sizes
- 📊 **Monitoring**: Comprehensive monitoring with Prometheus and Grafana
- 🐳 **Containerized**: Docker support for easy deployment
- 🔄 **Real-time Tracking**: User interaction tracking for ML recommendations
- 🎯 **Smart Recommendations**: Personalized for logged-in users, session-based for guests

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

### AWS Services
- **AWS S3** - File storage with bucket policy/ACL support
- **AWS Personalize** - Machine learning recommendations
- **AWS SDK v3** - Modern AWS service integration

### Monitoring
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Node Exporter** for system metrics
- **MongoDB Exporter** for database metrics
- **cAdvisor** for container metrics

### Payment Gateways
- **Stripe** for international payments
- **Razorpay** for Indian payments
- **Cash on Delivery (COD)**

## 📁 Project Structure

```
├── apps/
│   ├── frontend/          # React.js e-commerce frontend (Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── PersonalizedRecommendations.jsx  # AI recommendations
│   │   │   │   ├── RelatedProducts.jsx              # Product suggestions
│   │   │   │   └── ...
│   │   │   ├── pages/
│   │   │   │   ├── Collection.jsx                   # Paginated products
│   │   │   │   ├── Product.jsx                      # Product details + tracking
│   │   │   │   └── ...
│   │   │   └── context/
│   │   │       └── ShopContext.jsx                  # State + event tracking
│   │   └── package.json
│   │
│   ├── admin/             # Admin panel for management
│   │   ├── src/
│   │   │   └── pages/
│   │   │       └── List.jsx                         # Paginated product list
│   │   └── package.json
│   │
│   └── backend/           # Node.js API server
│       ├── config/
│       │   ├── s3.js                                # S3 client config
│       │   ├── personalize.js                       # Personalize config
│       │   ├── mongodb.js                           # Database config
│       │   └── cloudinary.js                        # Cloudinary config
│       ├── controllers/
│       │   ├── productController.js                 # Product CRUD + pagination
│       │   ├── personalizeController.js             # Recommendations API
│       │   ├── orderController.js                   # Orders + purchase tracking
│       │   └── ...
│       ├── utils/
│       │   ├── uploadToS3.js                        # S3 upload with metadata
│       │   ├── personalizeEvents.js                 # Event tracking utility
│       │   └── personalizeRecommendations.js        # Fetch recommendations
│       ├── routes/
│       │   ├── personalizeRoute.js                  # Personalize endpoints
│       │   └── ...
│       └── package.json
│
├── monitoring/            # Prometheus and Grafana configuration
│   ├── prometheus.yml
│   ├── alert_rules.yml
│   └── grafana/
│
├── packages/              # Shared packages and configurations
│   ├── eslint-config/
│   └── typescript-config/
│
├── docker-compose.monitoring.yml
├── AWS_PERSONALIZE_SETUP.md      # Complete AWS Personalize guide
└── README.md
```

## 🔧 Environment Setup

### 1. Clone the repository
```bash
git clone https://github.com/codingislub/Ecomaws.git
cd ecom
```

### 2. Set up environment variables
Copy the example files and configure your credentials:

```bash
# Root directory
cp .env.example .env

# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env

# Admin
cp apps/admin/.env.example apps/admin/.env
```

### 3. Configure your .env files

**Root `.env`** (for monitoring):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your_password
```

**Backend `.env`**:
```env
# Server
PORT=4000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Cloudinary (optional - if not using S3 exclusively)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_S3_PUBLIC_READ=true                              # Enable public-read ACL (optional)
PUBLIC_ASSET_BASE_URL=https://your-cdn-url.com       # CloudFront URL (optional)
S3_CACHE_CONTROL=public, max-age=86400               # Cache control (optional)

# AWS Personalize Configuration (see AWS_PERSONALIZE_SETUP.md)
PERSONALIZE_TRACKING_ID=your-tracking-id
PERSONALIZE_CAMPAIGN_ARN=arn:aws:personalize:region:account:campaign/name
PERSONALIZE_DATASET_GROUP_ARN=arn:aws:personalize:region:account:dataset-group/name
```

**Frontend `.env`**:
```env
VITE_BACKEND_URL=http://localhost:4000
```

**Admin `.env`**:
```env
VITE_BACKEND_URL=http://localhost:4000
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose
- MongoDB Atlas account
- Cloudinary account
- AWS S3 bucket
- Stripe/Razorpay accounts

### Install dependencies
```bash
npm install
```

## 🎯 Running the Application

### Development Mode

1. **Start all applications**:
```bash
npm run dev
```

2. **Start individual applications**:
```bash
# Frontend only
npm run dev --filter=frontend

# Backend only
npm run dev --filter=backend

# Admin panel only
npm run dev --filter=admin
```

### Access the applications:
- **Frontend**: http://localhost:5173 (or check terminal for actual port)
- **Admin Panel**: http://localhost:5174 (or check terminal for actual port)
- **Backend API**: http://localhost:4000

## ☁️ AWS Services

### AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create a new bucket
   - Configure bucket policy or ACLs for public access (if needed)

2. **Configure Public Access**
   
   **Option A: Using Bucket Policy (Recommended)**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
       }
     ]
   }
   ```

   **Option B: Using ACLs**
   - Disable "Block Public Access" for ACLs
   - Set `AWS_S3_PUBLIC_READ=true` in .env

3. **Optional: CloudFront Setup**
   - Create CloudFront distribution pointing to your S3 bucket
   - Set `PUBLIC_ASSET_BASE_URL` to CloudFront domain in .env

### AWS Personalize Setup

For complete AWS Personalize setup instructions, see [AWS_PERSONALIZE_SETUP.md](./AWS_PERSONALIZE_SETUP.md).

**Quick Overview:**
1. Create Dataset Group in AWS Personalize Console
2. Create Interactions, Items, and Users datasets
3. Create Event Tracker (get Tracking ID)
4. Create Solution with chosen recipe
5. Create Campaign (get Campaign ARN)
6. Add credentials to backend .env

**Features:**
- ✅ Automatic event tracking (views, cart adds, purchases)
- ✅ Personalized recommendations on homepage
- ✅ AI-powered related products
- ✅ Works for both logged-in users and guests
- ✅ Graceful fallback to bestsellers if not configured

## 📊 Monitoring

### Start Monitoring Stack
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Monitoring Tools:
- **🔍 Prometheus**: http://localhost:9090
- **📊 Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: (from your .env file)
- **📊 cAdvisor**: http://localhost:8080
- **💾 Node Exporter**: http://localhost:9100
- **🍃 MongoDB Exporter**: http://localhost:9216

### Stop Monitoring Stack
```bash
docker-compose -f docker-compose.monitoring.yml down
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

### Product Endpoints
- `GET /api/product/list?page=1&limit=36` - Get products with pagination
- `POST /api/product/add` - Add new product (admin)
- `POST /api/product/remove` - Remove product (admin)
- `POST /api/product/single` - Get single product details
- `DELETE /api/product/cleanup-csv` - Cleanup CSV imported products (admin)

### Order Endpoints
- `POST /api/order/place` - Place order with COD
- `POST /api/order/stripe` - Place order with Stripe
- `POST /api/order/razorpay` - Place order with Razorpay
- `POST /api/order/verifyStripe` - Verify Stripe payment
- `POST /api/order/verifyRazorpay` - Verify Razorpay payment
- `GET /api/order/userorders` - Get user orders
- `GET /api/order/list` - Get all orders (admin)
- `POST /api/order/status` - Update order status (admin)

### Cart Endpoints
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/update` - Update cart quantity
- `POST /api/cart/get` - Get cart items

### AWS Personalize Endpoints
- `POST /api/personalize/track/view` - Track product view
- `POST /api/personalize/track/cart` - Track add to cart
- `POST /api/personalize/track/purchase` - Track purchase
- `GET /api/personalize/recommendations?userId=xxx&numResults=10` - Get personalized recommendations
- `GET /api/personalize/recommendations/:productId?numResults=6` - Get related products

### Pagination
Most list endpoints support pagination with query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 36 for frontend, 10 for admin)

Example: `GET /api/product/list?page=2&limit=36`

## 🔧 Build for Production

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Copy `.env.example` files to `.env` and configure your environment
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 Additional Documentation

- [AWS Personalize Setup Guide](./AWS_PERSONALIZE_SETUP.md) - Complete guide for setting up AI recommendations

## 🔒 Security Notes

1. Never commit `.env` files to version control
2. Use environment variables for all sensitive data
3. Keep AWS credentials secure
4. Use strong JWT secrets
5. Enable CORS only for trusted domains in production
6. Use HTTPS in production
7. Consider using AWS IAM roles instead of access keys in production

## 📊 Pagination Details

### Frontend (Collection Page)
- **Items per page**: 36 products
- **UI**: Numbered page buttons with Previous/Next
- **Features**: Smart ellipsis for large page counts, auto-scroll on page change

### Admin Panel (Product List)
- **Items per page**: 10 products
- **UI**: Simple Previous/Next with page counter
- **Display**: Shows "Page X of Y (Z total products)"

### Backend
- Default limit: 36 (configurable via query param)
- Returns pagination metadata: `total`, `page`, `limit`, `totalPages`
- Sorts products by date (newest first)

## 🎯 Event Tracking Flow

1. **Product View** → Tracked automatically when user opens product page
2. **Add to Cart** → Tracked when item added to cart
3. **Purchase** → Tracked on successful order (COD, Stripe, Razorpay)

All events include user ID (JWT for logged-in, session for guests) and product metadata.

## 🚀 Production Deployment

### Build Commands
```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=frontend
npm run build --filter=admin
npm run build --filter=backend
```

### Deployment Checklist
- [ ] Configure production environment variables
- [ ] Set up production MongoDB database
- [ ] Configure AWS S3 bucket and IAM permissions
- [ ] Set up AWS Personalize (optional)
- [ ] Configure payment gateway production keys
- [ ] Set up CloudFront for S3 assets (recommended)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up monitoring alerts
- [ ] Test all payment methods
- [ ] Verify image uploads work
- [ ] Test recommendations (if using Personalize)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**codingislub**
- GitHub: [@codingislub](https://github.com/codingislub)

## 🙏 Acknowledgments

- React.js and Vite for the amazing frontend tools
- MongoDB for the flexible database
- AWS for cloud services (S3, Personalize)
- Stripe and Razorpay for payment integrations
- Prometheus and Grafana for monitoring capabilities

