# E-commerce Website

A **cloud-native, full-stack e-commerce platform** built with React, Node.js, Express, MongoDB, and EJS.  
Supports secure payments, real-time updates, and scalable cloud deployment.

---

## 🌐 Live URLs

- **Frontend:** [E-commerce Website](https://ecom-frontend.aryan.college)  
- **Backend API:** [Backend](https://ecom-backend.aryan.college)  
- **Admin Panel:** [Admin Dashboard](https://ecom-admin.aryan.college)  

---

## 🛠️ Technology Stack

- **Frontend:** React, EJS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB, SQL (for bookings/payments)  
- **Payments:** Stripe, Razorpay  
- **Cloud Services (AWS):** S3 (image storage), Lambda (serverless functions), EC2 (hosting), CloudFront (CDN), CloudWatch (monitoring), API Gateway  

---

## ⚙️ Features

- **User-facing:**  
  - Mobile-first design with dynamic search (location, price, amenities)  
  - Real-time updates and caching for performance  
  - Secure checkout with Stripe & Razorpay  

- **Admin:**  
  - Product & order management via Admin Dashboard  
  - Admin Login Credentials:  
    - Email: `admin@example.com`  
    - Password: `Abcd@4321`  

- **Cloud & Monitoring:**  
  - Images stored on **AWS S3** via **Lambda-triggered uploads**  
  - Application deployed on **EC2**  
  - Logs monitored using **CloudWatch**  

---

## 🔗 API Endpoints

- Backend URL: `https://ecom-backend.aryan.college`  
- Example endpoints:  
  - `GET /api/product/list` – List all products  
  - `POST /api/admin/login` – Admin authentication  

---

## 🚀 Getting Started (Development)

1. Clone the repo:
   ```bash
   git clone https://github.com/codingislub/E-commerce.git
   cd E-commerce
