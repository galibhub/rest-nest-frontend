# 🏠 RentNest Frontend

<p align="center">
  <b>A modern rental property management frontend built with Next.js, TypeScript, Tailwind CSS, Zustand, Axios, and Stripe Checkout.</b>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.1-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</p>

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🚀 Live Frontend | https://restnest-frontend-omega.vercel.app |
| 🔌 Live Backend API | https://restnest-backend-pied.vercel.app |
| 💻 Frontend Repository | https://github.com/galibhub/rest-nest-frontend |
| 🖥️ Backend Repository | https://github.com/galibhub/Rest-nest |

---

# 📖 Project Overview

RentNest is a full-stack rental property management platform that connects tenants, landlords, and administrators in one system.

The frontend provides a role-based experience for:

- Discovering rental properties
- Searching and filtering properties
- Submitting rental requests
- Managing properties as a landlord
- Approving or rejecting rental requests
- Monitoring payments
- Managing users as an administrator
- Reviewing properties after an active rental

The frontend communicates with the RentNest REST API backend and uses Stripe Checkout for rental payments.

---

# ✨ Key Features

## 🔐 Authentication

- User registration
- User login
- Logout
- JWT-based authentication
- HTTP-only authentication cookies
- Role-based dashboard routing
- Tenant / Landlord / Admin access

---

## 👤 Tenant Features

- Browse all properties
- Search properties
- Filter properties
- View property details
- View availability
- Submit rental requests
- Track rental request status
- View rental request history
- Pay approved rental requests
- View payment history
- View active rentals
- Submit property reviews
- Edit own reviews
- Delete own reviews

---

## 🏠 Landlord Features

- Landlord dashboard
- View owned properties
- Create properties
- Edit properties
- Delete properties
- View incoming rental requests
- Approve rental requests
- Reject rental requests
- View payment overview
- View completed / pending payments
- View rental revenue

---

## 👨‍💼 Admin Features

- Admin dashboard
- View all users
- Search users
- Filter users by status
- Block users
- Unblock users
- View platform properties
- Search platform properties
- Monitor property availability
- View rental requests
- Monitor request status
- View platform payments
- Monitor completed / pending payments
- View platform revenue

---

## 💳 Payment Features

- Stripe Checkout integration
- Approved rental requests can initiate payment
- Stripe success page
- Stripe cancel page
- Payment history
- Payment status display
- Backend webhook-based payment completion
- Rental activation after successful payment

### Payment Flow

```text
Approved Rental Request
        ↓
Pay Now
        ↓
Stripe Checkout
   ┌────┴────┐
   ↓         ↓
Success    Cancel
   ↓         ↓
/payment/  /payment/
success    cancel
   ↓
Stripe Webhook
   ↓
Payment = COMPLETED
   ↓
Rental = ACTIVE
   ↓
Property = RENTED
```

---

## ⭐ Review Features

- Property review list
- Average rating
- 1–5 star rating
- Create review
- Edit own review
- Delete own review
- Active-rental eligibility enforced by backend
- One review per tenant per property

---

# 👥 User Roles

| Role | Responsibilities |
|---|---|
| 👤 Tenant | Browse properties, request rentals, pay, review |
| 🏠 Landlord | Manage properties, approve/reject requests, monitor payments |
| 👨‍💼 Admin | Manage users and monitor platform activity |

---

# 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👨‍💼 Admin | `admin@gmail.com` | `12345678` |
| 🏠 Landlord | `landlord@gmail.com` | `12345678` |
| 👤 Tenant | `tenant@gmail.com` | `12345678` |

> Demo credentials are for testing and demonstration purposes.

---

# 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.3.1 |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Validation | Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| Payments | Stripe Checkout |
| Deployment | Vercel |

---

# 📂 Project Structure

```text
rentnest-frontend/
│
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── landlord/
│   │   │   ├── payments/
│   │   │   ├── properties/
│   │   │   └── requests/
│   │   ├── tenant/
│   │   │   ├── payments/
│   │   │   └── requests/
│   │   └── page.tsx
│   │
│   ├── payment/
│   │   ├── cancel/
│   │   └── success/
│   │
│   └── properties/
│       ├── [id]/
│       └── page.tsx
│
├── components/
│   ├── property/
│   │   └── PropertyReviews.tsx
│   └── shared/
│
├── services/
│   ├── admin.service.ts
│   ├── auth.service.ts
│   ├── payment.service.ts
│   ├── property.service.ts
│   ├── rental-request.service.ts
│   └── review.service.ts
│
├── store/
│   └── auth.store.ts
│
├── types/
│   ├── admin.ts
│   ├── auth.ts
│   ├── landlord.ts
│   ├── property.ts
│   └── review.ts
│
├── utils/
│   └── cookies.ts
│
├── public/
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

## Development

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Production

Vercel Production Environment:

```env
NEXT_PUBLIC_API_URL=https://restnest-backend-pied.vercel.app/api
```

> Do not commit `.env.local` or any secret environment variables to GitHub.

---

# 🚀 Local Development

## 1. Clone Repository

```bash
git clone https://github.com/galibhub/rest-nest-frontend.git
cd rest-nest-frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 4. Start Development Server

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:3001
```

Make sure the backend API is running.

---

# 🧪 Production Build

Before deployment:

```bash
npm run build
```

The project should complete the Next.js production build successfully.

---

# 🚀 Deployment

The frontend is deployed on Vercel.

### Production

```bash
vercel --prod
```

Live frontend:

```text
https://restnest-frontend-omega.vercel.app
```

### Backend

Live backend:

```text
https://restnest-backend-pied.vercel.app
```

---

# 🔌 Backend API

Production API base URL:

```text
https://restnest-backend-pied.vercel.app/api
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Users

```text
GET   /api/users
PATCH /api/users/:id/status
```

## Categories

```text
POST /api/categories
GET  /api/categories
```

## Properties

```text
POST   /api/properties
GET    /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
DELETE /api/properties/:id
GET    /api/properties/admin
```

## Rental Requests

```text
POST  /api/rentals
GET   /api/rentals/landlord
PATCH /api/rentals/:id/approve
PATCH /api/rentals/:id/reject
GET   /api/rentals/admin
```

## Payments

```text
POST /api/payments/create-checkout-session
GET  /api/payments
GET  /api/payments/:id
POST /api/payments/webhook
```

## Reviews

```text
POST   /api/reviews
GET    /api/reviews
GET    /api/reviews/:id
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

---

# 🔄 Main Rental Workflow

```text
Tenant Login
      ↓
Browse Properties
      ↓
Property Details
      ↓
Request to Rent
      ↓
Landlord Reviews Request
      ↓
Approve / Reject
      ↓
Tenant Pays
      ↓
Stripe Checkout
      ↓
Webhook
      ↓
Payment Completed
      ↓
Rental Active
      ↓
Property Rented
      ↓
Tenant Can Review
```

---

# ⭐ Review Workflow

```text
Active Tenant Rental
        ↓
Property Details
        ↓
Reviews
        ↓
Write Review
        ↓
1–5 Star Rating
        ↓
Comment
        ↓
Submit
        ↓
Edit / Delete Own Review
```

---

# 🔒 Security Notes

- Never commit `.env.local`
- Never expose Stripe secret keys in frontend code
- Never expose JWT secrets in frontend code
- Keep authentication tokens in secure HTTP-only cookies where applicable
- Use HTTPS in production
- Configure CORS for the production frontend origin
- Rotate credentials if a secret has been accidentally exposed
- Keep production secrets inside Vercel Environment Variables

---

# ✅ Current Project Status

The frontend currently includes:

```text
✅ Authentication
✅ Role-based routing
✅ Tenant dashboard
✅ Landlord dashboard
✅ Admin dashboard
✅ Property browsing
✅ Property search / filter
✅ Property details
✅ Property CRUD
✅ Rental requests
✅ Request approval / rejection
✅ Stripe payment integration
✅ Payment history
✅ Payment success / cancel pages
✅ Review system
✅ Production deployment
✅ Production API integration
```

---

# 👨‍💻 Author

**Ibrahim Ahmed Galib**

🎓 B.Sc. in Computer Science & Engineering  
🏫 Daffodil International University

GitHub:  
https://github.com/galibhub

Frontend Repository:  
https://github.com/galibhub/rest-nest-frontend

Backend Repository:  
https://github.com/galibhub/Rest-nest

---

# 📄 License

This project is licensed under the MIT License.

---

<p align="center">
Made with ❤️ for RentNest
</p>
