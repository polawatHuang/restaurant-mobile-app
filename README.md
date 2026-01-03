# Thai Restaurant System - Mobile App

A comprehensive Next.js-based restaurant management system with multi-role support.

## Features

### User Features
- QR code scan for table check-in
- Browse and order menu items
- View order status in real-time
- Pay bills online
- Call waiter service
- Share payment page with friends

### Cooker Features
- Manage and track orders
- Manage ingredient inventory

### Admin Features
- Manage users (cookers and admins)
- Manage menu categories
- Manage menu items
- View sales reports (daily/monthly/yearly)
- Career path system (salary and improvement points)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM
- **Authentication:** NextAuth.js
- **Charts:** Recharts

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set the `BACKEND_API_URL` to your backend API endpoint.

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin:** admin@restaurant.com / admin123
- **Cooker:** cooker@restaurant.com / cooker123

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/types` - TypeScript type definitions

## Features Overview

### User Role
- Scan QR code to check-in to a table
- Browse menu by categories
- Add items to cart and place orders
- View order status in real-time
- Pay bills (cash or QR code)
- Call waiter for assistance
- Share payment page with friends

### Cooker Role
- View and manage all orders
- Update order and item status
- Track ingredient inventory
- Monitor low stock items

### Admin Role
- Manage users (create, edit, delete)
- Manage menu categories and items
- View sales reports (daily/monthly/yearly)
- Manage cooker career paths (salary, improvement points, levels)
- Generate QR codes for tables

