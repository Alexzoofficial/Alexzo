# Alexzo - AI-Powered Platform

## Overview
This is a Next.js application called "Alexzo" - an AI-powered platform that transforms ideas with cutting-edge AI technology. The project has been successfully migrated from Supabase to Firebase and set up to run in the Replit environment.

## Project Architecture
- **Framework**: Next.js 15.2.4 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **Authentication**: Firebase Auth with Google OAuth (migrated from Supabase)
- **Database**: Firestore (migrated from Supabase)
- **Styling**: Tailwind CSS with custom theming
- **Analytics**: Google Analytics integration
- **Development Server**: Running on port 5000 with 0.0.0.0 binding

## Current State
- ✅ Dependencies installed with `--legacy-peer-deps` to resolve React version conflicts
- ✅ Next.js development server configured for Replit environment with proper host allowlist
- ✅ Frontend workflow running on port 5000
- ✅ Application compiling and serving successfully
- ✅ Deployment configuration set up for autoscale production deployment
- ✅ **Firebase integration successfully implemented** (migrated from Supabase)
- ✅ **Firebase configuration error fixed** - Application gracefully handles missing credentials
- ✅ Security vulnerabilities resolved (hardcoded credentials removed)
- ✅ TypeScript configuration properly set up with Node.js types
- ✅ **GitHub import successfully completed and ready for use**

## Recent Changes
- **2025-09-19**: Navigation and UI Improvements
  - **Fixed navigation issues**: Added back buttons to all pages that were missing them (Privacy Policy, About, LearnFlow Privacy Policy)
  - **Improved logo styling**: Ensured consistent logo presentation across all pages with proper sizing and styling
  - **Enhanced user experience**: Users can now easily navigate back from any page using the ArrowLeft back button
  - **Consistent header design**: Applied unified header pattern across all pages for better user experience

- **2025-09-14**: Fresh GitHub import and complete Firebase migration + Authentication Flow Fix
  - Installed Node.js dependencies with legacy peer deps flag to resolve React version conflicts
  - **Successfully migrated from Supabase to Firebase** as requested
  - Replaced authentication system with Firebase Auth and Google OAuth
  - Migrated database operations from Supabase to Firestore
  - Updated all API routes (contact, newsletter, waitlist, reset-password) to use Firebase Admin SDK
  - Verified Next.js development server runs properly on port 5000 with 0.0.0.0 binding
  - Confirmed application compiles successfully and serves pages (GET / 200)
  - Set up deployment configuration for autoscale production deployment
  - **FIXED Google OAuth Authentication Flow**: Resolved issue where "Get Started" button showed false success messages instead of proper Google authentication
  - Fixed auth callback page to properly handle OAuth errors and timeouts
  - Fixed OAuth flow mismatch between popup-based authentication and redirect-based callback
  - **Authentication now works properly**: Get Started → Google OAuth Popup → Success Message → Access to Avatar API and Settings
  - Successfully completed GitHub import and Firebase migration with working authentication

## Firebase Configuration  
✅ **Firebase integration successfully implemented!**
- Authentication: Firebase Auth with Google OAuth provider
- Database: Firestore for data storage and user profiles
- Environment variables: `NEXT_PUBLIC_FIREBASE_*` for client, `FIREBASE_PRIVATE_KEY`/`FIREBASE_CLIENT_EMAIL` for admin
- Client-side Firebase configuration in `lib/firebase/client.ts`
- Server-side Firebase Admin setup with lazy imports in API routes
- Authentication context migrated to Firebase (`lib/auth-context.tsx`)
- All API routes updated to use Firestore instead of Supabase
- Security: Hardcoded defaults removed, fails closed when credentials missing

## Database Schema
The project includes Supabase migrations in `/supabase/migrations/`:
- User profiles table
- Data tables
- Password hashing
- Password reset codes

## Features
- Modern AI-powered platform interface
- User authentication (demo mode and Supabase)
- Blog functionality
- Contact forms
- Newsletter signup
- User dashboard
- Responsive design with dark/light theme
- Analytics integration

## Development
- Development server: `npm run dev`
- Build: `npm run build`
- Production start: `npm start`
- Linting: `npm run lint`

## Deployment
Configured for Replit autoscale deployment:
- Build command: `npm run build`
- Start command: `npm start`
- Target: autoscale (for stateless website)