# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js that transforms ideas using advanced AI technology. Its primary purpose is to provide a modern interface for users to interact with AI capabilities, offering features such as user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components leverage Radix UI styled with Tailwind CSS, including custom theming for a responsive design with dark/light modes. Firebase Auth with Google OAuth handles user authentication, and Firestore serves as the primary database, migrated from a previous Supabase implementation. The system incorporates Google Analytics for tracking and runs on a development server configured for the Replit environment. Core features include an AI-powered platform interface, user authentication, blog functionality, contact forms, newsletter sign-ups, and a user dashboard.

## External Dependencies
- **Firebase**:
    - Firebase Auth (for authentication with Google OAuth)
    - Firestore (for database operations)
    - Firebase Admin SDK (for server-side operations in API routes)
- **Next.js**: The core web framework.
- **Radix UI**: For unstyled, accessible UI components.
- **Tailwind CSS**: For utility-first styling.
- **Google Analytics**: For tracking and analytics.

## Recent Changes
- **2025-10-04**: Complete Removal of API Request Tracking - COMPLETED
  - ✅ **Removed request tracking completely** - All API request counting functionality permanently removed from the application
  - ✅ **Removed 'requests' field** - Removed from APIKey interface in both `/app/api/page.tsx` and `/app/api/dashboard/page.tsx`
  - ✅ **Removed real-time updates** - Removed all polling, storage event listeners, and custom event listeners
  - ✅ **Removed request count displays** - Removed "Total Requests" from Analytics Overview and request counts from API key listings
  - ✅ **Disabled tracking functions** - Made trackAPIRequest() and useAPIKeyUpdates() no-op functions in `lib/api-tracker.ts`
  - ✅ **Removed all tracking calls** - Removed trackAPIRequest() calls from dashboard and playground pages
  - ✅ **No LSP errors** - All TypeScript errors resolved, application compiles successfully
  - ✅ **Architect reviewed and approved** - Changes verified as complete, no broken references, all key workflows function correctly