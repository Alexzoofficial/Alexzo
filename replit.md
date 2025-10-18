# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js that transforms ideas using advanced AI technology. Its primary purpose is to provide a modern interface for users to interact with AI capabilities, offering features such as user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components leverage Radix UI styled with Tailwind CSS, including custom theming for a responsive design with dark/light modes. Firebase serves as the complete backend solution, providing authentication with Google OAuth and Firestore database for data storage. The system incorporates Google Analytics for tracking and runs on a development server configured for the Replit environment. Core features include an AI-powered platform interface, user authentication, blog functionality, contact forms, newsletter sign-ups, and a user dashboard.

## External Dependencies
- **Firebase** (Primary Backend):
    - Firebase Auth (authentication with Google OAuth)
    - Firebase Firestore (NoSQL cloud database)
    - Firebase Admin SDK (server-side operations in API routes)
- **Next.js**: The core web framework.
- **Radix UI**: For unstyled, accessible UI components.
- **Tailwind CSS**: For utility-first styling.
- **Google Analytics**: For tracking and analytics.

## Replit Environment Setup
- **Development Server**: Configured to run on port 5000 at 0.0.0.0
- **Next.js Configuration**: Pre-configured with Replit domain support in `next.config.mjs`
- **Workflow**: "Next.js Dev Server" workflow runs `npm run dev` on port 5000
- **Dependencies**: Installed with `--legacy-peer-deps` flag due to React 19 compatibility
- **Deployment**: Configured for autoscale deployment with build and start commands
- **Firebase**: Optional - App runs without Firebase (auth features disabled) if environment variables not set

## Firebase Configuration
Firebase authentication is **ENABLED** and configured via `.env.local` file (gitignored for security).

**Configuration includes:**
- Client-side (Browser): All NEXT_PUBLIC_FIREBASE_* environment variables
- Server-side (Backend): Firebase Admin SDK credentials (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)

The `.env.local` file contains all Firebase credentials and is automatically loaded by Next.js. This file is in `.gitignore` to prevent committing sensitive credentials to version control.

## Database Schema
Firebase Firestore collections store application data:
- **contact_submissions**: Contact form submissions (name, email, company, subject, category, message, source, status, submittedAt, createdAt)
- **newsletter_subscriptions**: Newsletter subscriptions (email, source, active, subscribedAt, createdAt)
- **waitlist_submissions**: Waitlist entries (name, email, product, company, useCase, source, status, submittedAt, createdAt)
- **api_keys**: API authentication keys (userId, name, key, created, lastUsed) - Note: requestCount removed per user requirement
- **custom_apis**: Custom API endpoint configurations (userId, name, description, endpoint, method, status, successRate, createdAt, apiKey) - Note: request tracking disabled

All database operations use Firebase Admin SDK via `getAdminFirestore()` from `lib/firebase/admin.ts`. The application gracefully handles cases where Firebase is not configured.

**Important Notes:**
- Request tracking and counting have been completely disabled per user requirement
- Generated images are NOT saved to database or localStorage per user requirement
- API deletions are instant and remove data from Firestore immediately

## Recent Changes
- **2025-10-04**: GitHub Import Setup for Replit - COMPLETED
  - ✅ **Installed dependencies** - Used `npm install --legacy-peer-deps` to resolve React 19 peer dependency conflicts
  - ✅ **Configured workflow** - Set up "Next.js Dev Server" on port 5000 with webview output
  - ✅ **Verified build** - Production build tested successfully, all routes compile without errors
  - ✅ **Configured deployment** - Set up autoscale deployment with proper build and run commands
  - ✅ **Website functional** - App loads correctly, navigation works, gracefully handles missing Firebase config
  
- **2025-10-04**: Complete Removal of API Request Tracking - COMPLETED
  - ✅ **Removed request tracking completely** - All API request counting functionality permanently removed from the application
  - ✅ **Removed 'requests' field** - Removed from APIKey interface in both `/app/api/page.tsx` and `/app/api/dashboard/page.tsx`
  - ✅ **Removed real-time updates** - Removed all polling, storage event listeners, and custom event listeners
  - ✅ **Removed request count displays** - Removed "Total Requests" from Analytics Overview and request counts from API key listings
  - ✅ **Disabled tracking functions** - Made trackAPIRequest() and useAPIKeyUpdates() no-op functions in `lib/api-tracker.ts`
  - ✅ **Removed all tracking calls** - Removed trackAPIRequest() calls from dashboard and playground pages
  - ✅ **No LSP errors** - All TypeScript errors resolved, application compiles successfully
  - ✅ **Architect reviewed and approved** - Changes verified as complete, no broken references, all key workflows function correctly

- **2025-10-05**: Migration to Neon Postgres with Drizzle ORM - COMPLETED
  - ✅ **Installed Drizzle packages** - Added drizzle-orm, @neondatabase/serverless, drizzle-kit, ws, @types/ws
  - ✅ **Created database schema** - Built comprehensive Drizzle schema in `shared/schema.ts` based on Supabase migrations
  - ✅ **Configured database** - Set up `server/db.ts` with Neon serverless connection pool
  - ✅ **Added database scripts** - Added `db:push`, `db:generate`, and `db:studio` commands to package.json
  - ✅ **Pushed schema to Neon** - Successfully deployed all 6 tables (profiles, newsletter_subscriptions, waitlist_submissions, contact_submissions, apis, api_analytics)
  - ✅ **Migrated API routes** - Converted newsletter, contact, and waitlist routes from Firebase/Firestore to Drizzle with Postgres
  - ✅ **Removed Supabase packages** - Uninstalled @supabase/auth-helpers-nextjs and @supabase/supabase-js
  - ✅ **Updated TypeScript config** - Added @shared path mapping for schema imports
  - ✅ **Removed Supabase migrations** - Deleted supabase/ directory as it's no longer needed
  - ✅ **Verified functionality** - Application compiles and runs successfully on port 5000
  - ✅ **Architect reviewed** - All changes verified, schema matches migrations, database operations working correctly

- **2025-10-05**: Fixed Vercel Build Error - COMPLETED
  - ✅ **Issue**: Build failed with "DATABASE_URL must be set" error during Vercel deployment
  - ✅ **Root cause**: Database initialization happened at module import time, before runtime env vars were available
  - ✅ **Solution**: Implemented lazy database initialization using Proxy pattern in `server/db.ts`
  - ✅ **Result**: Build now succeeds - DATABASE_URL is only checked when database is actually accessed at runtime
  - ✅ **Verified**: Production build completes successfully, application runs normally in development

- **2025-10-16**: Firebase Configuration Setup - COMPLETED
  - ✅ **Created .env.local file** - Set up secure Firebase configuration for both client and server-side
  - ✅ **Client credentials configured** - Added all NEXT_PUBLIC_FIREBASE_* environment variables (API key, project ID, app ID, etc.)
  - ✅ **Server credentials configured** - Added Firebase Admin SDK credentials (private key, client email) for backend operations
  - ✅ **Security enhanced** - All credentials stored in .env.local which is gitignored to prevent exposure in version control
  - ✅ **Deleted sensitive files** - Removed temporary Firebase service account JSON files from attached_assets for security
  - ✅ **Firebase initialized successfully** - Verified Firebase authentication is fully operational (logs show "Firebase initialized successfully")
  - ✅ **Auth system confirmed** - Application shows isFirebaseConfigured: true, authentication features enabled

- **2025-10-17**: Complete Migration to Firebase (Neon Postgres Removed) - COMPLETED
  - ✅ **Removed Neon Postgres** - Deleted all Neon database files (server/db.ts, drizzle.config.ts, shared/schema.ts)
  - ✅ **Migrated to Firebase Firestore** - Converted contact, newsletter, and waitlist API routes to use Firebase Firestore
  - ✅ **Removed database packages** - Uninstalled @neondatabase/serverless, drizzle-orm, drizzle-kit, ws, @types/ws
  - ✅ **Removed database scripts** - Removed db:push, db:generate, db:studio scripts from package.json
  - ✅ **Removed Supabase references** - Cleaned up all deprecated Supabase config from lib/public-env.ts, env.d.ts, next.config.mjs
  - ✅ **Security verified** - .env.local properly gitignored, no secrets exposed in codebase
  - ✅ **Build verified** - Production build passes successfully, Firebase initialized correctly
  - ✅ **Architect approved** - Migration confirmed complete and production-ready, safe for GitHub deployment

- **2025-10-17**: Firebase Firestore Data Storage Fixed - COMPLETED
  - ✅ **Configured Firebase Admin SDK** - Set up service account credentials in .env.local with private key, client email, and project ID
  - ✅ **Verified API endpoints** - All three APIs (contact, newsletter, waitlist) successfully saving data to Firestore
  - ✅ **Tested Firestore writes** - Confirmed via logs: "Contact submission saved to Firebase Firestore" and "Waitlist submission saved to Firebase Firestore"
  - ✅ **Security hardened** - Removed service account JSON files from workspace, credentials only in .env.local (gitignored)
  - ✅ **GitHub push safe** - .gitignore properly excludes .env*, firebase credentials, sensitive files
  - ✅ **Architect reviewed** - Configuration verified, all Firestore persistence working correctly

- **2025-10-17**: Firebase Environment Variables Permanently Configured - COMPLETED
  - ✅ **Created .env.local file** - Set up complete Firebase credentials from user-provided config and service account JSON
  - ✅ **Client-side credentials** - Configured all NEXT_PUBLIC_FIREBASE_* variables (API key, project ID, app ID, messaging sender ID, auth domain, database URL, storage bucket, measurement ID)
  - ✅ **Server-side credentials** - Configured FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL for Admin SDK
  - ✅ **Security maintained** - Deleted service account JSON file after extracting credentials, .env.local gitignored
  - ✅ **Verified working** - Logs confirm "Firebase initialized successfully", isFirebaseConfigured: true
  - ✅ **Data persistence active** - Contact forms, newsletter, and waitlist submissions now saving permanently to Firebase Firestore
  - ✅ **GitHub safe** - .gitignore properly configured to exclude .env*, attached_assets/, and firebase JSON files

- **2025-10-17**: API Proxy Gateway Firebase Integration - COMPLETED
  - ✅ **Created API Keys Management** - Built /api/keys endpoints (GET, POST, DELETE) for CRUD operations on Firestore api_keys collection
  - ✅ **Implemented Usage Tracking** - Added /api/keys/track endpoint to log API usage to Firestore api_usage collection
  - ✅ **Updated API Proxy** - Modified /api/proxy/[...path]/route.ts to validate keys against Firestore and track usage
  - ✅ **Updated Generate Endpoint** - Modified /api/generate/route.ts to validate keys against Firestore and track usage
  - ✅ **Fixed Critical Security Issue** - Changed validation from prefix-only check to full Firestore verification (prevents fake keys)
  - ✅ **Created Helper Library** - Built lib/api-keys.ts for frontend integration with Firestore API key management
  - ✅ **Architect Verified** - All validation logic confirmed working correctly, security hardened
  - ✅ **API Keys Now Persistent** - API keys and usage data permanently stored in Firebase Firestore (no longer localStorage)

- **2025-10-18**: Complete Firebase Integration & Request Tracking Removal - COMPLETED
  - ✅ **Firebase Environment Setup** - Created .env.local with complete Firebase credentials from service account JSON
  - ✅ **API Dashboard Migration** - Updated /app/api/dashboard/page.tsx to use Firebase backend API (/api/keys) instead of localStorage
  - ✅ **API Create Page Migration** - Updated /app/api/create/page.tsx to use Firebase backend API (/api/custom-apis) instead of localStorage
  - ✅ **Created Custom APIs Backend** - Built /app/api/custom-apis/route.ts for CRUD operations on custom API configurations in Firestore
  - ✅ **Removed Request Tracking** - Completely disabled request counting in both frontend and backend per user requirement
  - ✅ **Removed Image Storage** - Disabled generated dog images from being saved to localStorage per user requirement
  - ✅ **Updated Track Endpoint** - Modified /api/keys/track/route.ts to only update lastUsed timestamp, no request counting
  - ✅ **Removed requestCount Field** - Removed from API keys creation and interface definitions
  - ✅ **All LSP Errors Fixed** - TypeScript compilation successful, no errors
  - ✅ **Instant Delete Working** - API deletion now instantly removes from Firestore database
  - ✅ **All Data Now Persistent** - API keys and custom API configurations permanently stored in Firebase Firestore