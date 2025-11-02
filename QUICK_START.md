# 🚀 Quick Start Guide

## Prerequisites
- PostgreSQL installed and running
- Node.js 18+ installed

## Step-by-Step Setup

### 1️⃣ Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/graduation_project?schema=public"
# NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 2️⃣ Create Database
```bash
# Using PostgreSQL command line
createdb graduation_project

# Or using psql
psql -U postgres
CREATE DATABASE graduation_project;
\q
```

### 3️⃣ Initialize Prisma
```bash
# Generate Prisma Client (REQUIRED - run this first!)
npx prisma generate

# Push schema to database
npm run prisma:push
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

### 5️⃣ Access the Application
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

## 🎯 Test the Authentication

### Register a New User
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"
4. You'll be redirected to login

### Login
1. Go to http://localhost:3000/login
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. You'll be redirected to home page

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio GUI

# Build
npm run build            # Build for production
npm start                # Start production server
```

## 🎨 Features

✅ White background design  
✅ Green accent buttons (#16a34a)  
✅ Modern ShadCN UI components  
✅ Responsive layout  
✅ Form validation  
✅ Error handling  
✅ Loading states  
✅ Secure password hashing  
✅ Session management  

## 📁 Key Files

- `app/login/page.tsx` - Login page
- `app/register/page.tsx` - Register page
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `app/api/register/route.ts` - Registration API
- `lib/auth.ts` - NextAuth configuration
- `prisma/schema.prisma` - Database schema

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Make sure database exists
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete project overview
- **env.example** - Environment variables template

## 🎉 You're Ready!

Your authentication system is now running with:
- ✅ Modern UI (white bg, green buttons)
- ✅ Secure authentication
- ✅ PostgreSQL database
- ✅ Type-safe code

Happy coding! 🚀
