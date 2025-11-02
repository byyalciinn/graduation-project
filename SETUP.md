# Authentication Setup Guide

This project uses **NextAuth.js v5** with **PostgreSQL** and **Prisma ORM** for authentication.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running locally or remotely
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Make sure you have PostgreSQL installed and running. Create a new database:

```sql
CREATE DATABASE graduation_project;
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (copy from `env.example`):

```bash
cp env.example .env
```

Edit the `.env` file with your actual values:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/graduation_project?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

### 4. Initialize Prisma

**IMPORTANT**: Generate Prisma Client first (required before starting the app):

```bash
npx prisma generate
```

### 5. Run Database Migrations

Create the database tables:

```bash
npx prisma db push
```

Or use migrations for production:

```bash
npx prisma migrate dev --name init
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Authentication Pages

- **Login Page**: `/login` - White background with green buttons
- **Register Page**: `/register` - User registration with validation

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Authentication**: NextAuth.js v5 (beta)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI Components**: ShadCN UI (custom styled with green theme)
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Password Hashing**: bcryptjs

## Project Structure

```
graduation-project/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth API route
│   │   └── register/
│   │       └── route.ts               # Registration API
│   ├── login/
│   │   └── page.tsx                   # Login page
│   ├── register/
│   │   └── page.tsx                   # Register page
│   ├── layout.tsx                     # Root layout with AuthProvider
│   └── page.tsx                       # Home page
├── components/
│   ├── providers/
│   │   └── session-provider.tsx       # NextAuth session provider
│   └── ui/
│       ├── button.tsx                 # Button component (green theme)
│       ├── input.tsx                  # Input component
│       ├── label.tsx                  # Label component
│       └── card.tsx                   # Card component
├── lib/
│   ├── auth.ts                        # NextAuth configuration
│   ├── prisma.ts                      # Prisma client singleton
│   └── utils.ts                       # Utility functions
├── prisma/
│   └── schema.prisma                  # Database schema
├── .env                               # Environment variables (create this)
└── env.example                        # Environment template
```

## Database Schema

The Prisma schema includes:

- **User**: Stores user credentials and profile
- **Account**: OAuth accounts (for future providers)
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

## Usage

### Register a New User

1. Navigate to `/register`
2. Fill in name, email, and password
3. Submit the form
4. Redirected to login page

### Login

1. Navigate to `/login`
2. Enter email and password
3. Submit the form
4. Redirected to home page on success

### Accessing User Session

In any component:

```tsx
'use client';

import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not logged in</div>;

  return <div>Welcome, {session?.user?.name}</div>;
}
```

In server components:

```tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {session.user?.name}</div>;
}
```

## Prisma Studio

To view and manage your database visually:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555`

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Prisma Client Errors

```bash
npx prisma generate
```

### Migration Issues

```bash
npx prisma migrate reset
npx prisma db push
```

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords for database
- Generate a secure NEXTAUTH_SECRET
- Use HTTPS in production
- Keep dependencies updated

## Next Steps

- Add email verification
- Implement password reset
- Add OAuth providers (Google, GitHub)
- Add role-based access control
- Implement session management
- Add two-factor authentication
