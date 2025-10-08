# 🛒 E-Commerce Application

A full-stack e-commerce application built with React.js, Node.js, and MongoDB, featuring complete monitoring with Prometheus and Grafana.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Monitoring](#monitoring)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

- 🛍️ **E-commerce Frontend**: Product catalog, shopping cart, user authentication
- ⚙️ **Admin Panel**: Product management, order tracking, user management
- 🔐 **Authentication**: JWT-based secure authentication
- 💳 **Payment Integration**: Stripe and Razorpay payment gateways
- 📦 **Order Management**: Complete order lifecycle management
- 🖼️ **Media Upload**: Cloudinary integration for image uploads
- ☁️ **Cloud Storage**: AWS S3 for file storage
- 📊 **Monitoring**: Comprehensive monitoring with Prometheus and Grafana
- 🐳 **Containerized**: Docker support for easy deployment

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads

### Monitoring
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Node Exporter** for system metrics
- **MongoDB Exporter** for database metrics
- **cAdvisor** for container metrics

### Services
- **Cloudinary** for image management
- **Stripe** and **Razorpay** for payments
- **AWS S3** for file storage

## 📁 Project Structure

```
├── apps/
│   ├── frontend/          # React.js e-commerce frontend
│   ├── admin/            # Admin panel for management
│   └── backend/          # Node.js API server
├── monitoring/           # Prometheus and Grafana configuration
├── packages/            # Shared packages and configurations
├── docker-compose.monitoring.yml
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
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_NAME=your_cloudinary_name
STRIPE_SECRET_KEY=sk_test_your_stripe_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_KEY_ID=your_razorpay_id
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket
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
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:4000

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
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (admin)
- `POST /api/product/remove` - Remove product (admin)

### Order Endpoints
- `POST /api/order/place` - Place new order
- `GET /api/order/userorders` - Get user orders
- `GET /api/order/list` - Get all orders (admin)

### Cart Endpoints
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `GET /api/cart/get` - Get cart items

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

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
