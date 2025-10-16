# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js that transforms ideas using advanced AI technology. Its primary purpose is to provide a modern interface for users to interact with AI capabilities, offering features such as user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components leverage Radix UI styled with Tailwind CSS, including custom theming for a responsive design with dark/light modes. Firebase Auth with Google OAuth handles user authentication (optional). The primary database is Neon Postgres, accessed via Drizzle ORM with type-safe queries. The system incorporates Google Analytics for tracking and runs on a development server configured for the Replit environment. Core features include an AI-powered platform interface, user authentication, blog functionality, contact forms, newsletter sign-ups, and a user dashboard.

## External Dependencies
- **Database**:
    - Neon Postgres (serverless Postgres database)
    - Drizzle ORM (type-safe database queries)
- **Firebase** (Optional):
    - Firebase Auth (for authentication with Google OAuth)
    - Firebase Admin SDK (for server-side operations in API routes)
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
The Neon Postgres database contains the following tables:
- **profiles**: User profiles with OAuth support (id, email, full_name, avatar_url, password_hash, provider, provider_id, last_sign_in, created_at, updated_at)
- **newsletter_subscriptions**: Email newsletter subscriptions (id, email, subscribed_at, source, active, created_at)
- **waitlist_submissions**: Product waitlist entries (id, name, email, product, company, use_case, submitted_at, source, status, created_at)
- **contact_submissions**: Contact form submissions (id, name, email, company, subject, category, message, submitted_at, source, status, created_at)
- **apis**: API endpoint management (id, user_id, name, description, endpoint, method, status, api_key, requests_count, success_rate, created_at, updated_at)
- **api_analytics**: API usage analytics (id, api_id, request_count, success_count, error_count, date, created_at)

Database operations use Drizzle ORM with the schema defined in `shared/schema.ts`. Run `npm run db:push` to sync schema changes to the database.

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