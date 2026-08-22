# RentNest

A full-stack rental property management platform built with Next.js, TypeScript, Tailwind CSS, Express.js, Prisma, PostgreSQL, JWT authentication, and Stripe.

## Live Deployment

Frontend: https://restnest-frontend-omega.vercel.app  
Backend API: https://restnest-backend-pied.vercel.app

## Features

### Authentication
- Register and login
- JWT authentication
- HTTP-only cookies
- Role-based access control
- Tenant, Landlord, and Admin dashboards
- Logout

### Tenant
- Browse properties
- Search and filter properties
- Property details
- Check availability
- Request to rent
- Track rental requests
- Payment history
- Stripe checkout
- Active rentals
- Property reviews

### Landlord
- Dashboard
- My properties
- Create property
- Edit property
- Delete property
- Rental requests
- Approve / reject requests
- Payment overview
- Revenue monitoring

### Admin
- Dashboard
- User management
- Search users
- Active / blocked filtering
- Block / unblock users
- Property monitoring
- Rental request monitoring
- Payment overview

### Payments
- Stripe Checkout
- Approved rental request payment
- Stripe webhook
- Payment status tracking
- Rental activation after successful payment
- Property availability update
- Success / cancel pages

### Reviews
- Property review list
- Average rating
- 1–5 star rating
- Create review
- Edit own review
- Delete own review
- Active-rental requirement enforced by backend

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `12345678` |
| Landlord | `landlord@gmail.com` | `12345678` |
| Tenant | `tenant@gmail.com` | `12345678` |

> Demo credentials are for testing only.

## Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- React Hook Form
- Zod
- Sonner
- Lucide React

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Stripe
- Zod

### Deployment
- Vercel

## Frontend Structure

```text
rentnest-frontend/
├── app/
│   ├── auth/
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── landlord/
│   │   └── tenant/
│   ├── payment/
│   └── properties/
├── components/
├── services/
├── store/
├── types/
├── utils/
├── public/
├── package.json
└── README.md
```

### Main Service Files

```text
services/
├── admin.service.ts
├── auth.service.ts
├── payment.service.ts
├── property.service.ts
├── rental-request.service.ts
└── review.service.ts
```

## Environment Variables

### Frontend

`.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Production:

```env
NEXT_PUBLIC_API_URL=https://restnest-backend-pied.vercel.app/api
```

### Backend

Keep secrets out of Git.

```env
DATABASE_URL=your_database_url
PORT=3000
APP_URL=http://localhost:3000

bcrypt_salt_rounds=10

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Production backend:

```env
APP_URL=https://restnest-frontend-omega.vercel.app
```

## Local Development

### Install

```bash
npm install
```

### Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Start

```bash
npm run dev
```

Frontend normally runs on:

```text
http://localhost:3001
```

Make sure the backend API is running.

## Production Build

```bash
npm run build
```

The build should complete successfully before deployment.

## Deployment

### Frontend

```bash
vercel --prod
```

### Backend

```bash
vercel --prod
```

## Main Business Flow

```text
Tenant
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
Stripe Webhook
  ↓
Payment = COMPLETED
  ↓
Rental Request = ACTIVE
  ↓
Property = RENTED
  ↓
Tenant Can Review Property
```

## API Overview

### Properties

```text
POST   /api/properties
GET    /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
DELETE /api/properties/:id
GET    /api/properties/admin
```

### Rental Requests

```text
POST   /api/rentals
GET    /api/rentals/landlord
PATCH  /api/rentals/:id/approve
PATCH  /api/rentals/:id/reject
GET    /api/rentals/admin
```

### Users

```text
GET    /api/users
PATCH  /api/users/:id/status
```

### Payments

```text
POST   /api/payments/create-checkout-session
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments/webhook
```

### Reviews

```text
POST   /api/reviews
GET    /api/reviews
GET    /api/reviews/:id
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

## Stripe

Stripe Checkout is used for rental payments.

Success:

```text
https://restnest-frontend-omega.vercel.app/payment/success
```

Cancel:

```text
https://restnest-frontend-omega.vercel.app/payment/cancel
```

The backend handles:

```text
checkout.session.completed
```

and updates payment, rental, and property state.

> Use Stripe test mode during development. Never commit secret Stripe keys.

## Security

- Never commit `.env` files.
- Never expose Stripe secret keys in frontend code.
- Never expose JWT secrets client-side.
- Use secure HTTP-only cookies in production.
- Use HTTPS in production.
- Rotate secrets that have been accidentally exposed.

## Current Status

Core platform functionality is implemented:

- Authentication
- Role-based dashboards
- Property listing and management
- Rental requests
- Landlord approval / rejection
- Payments
- Reviews
- Admin management
- Production frontend deployment
- Production backend deployment

## Author

**Ibrahim Ahmed Galib**

GitHub: https://github.com/galibhub

Frontend Repository: https://github.com/galibhub/rest-nest-frontend
