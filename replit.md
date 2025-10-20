# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js, designed to transform ideas using advanced AI technology. It offers a modern interface for interacting with AI capabilities, including user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## Recent Changes

### October 20, 2025 - Comprehensive SEO Enhancement & Image Indexing
- **Image Sitemap Implementation**: Enhanced sitemap.xml with Google Image Sitemap schema. Added all 29+ images from blog, products, press, showcase, and avatar directories with proper image:image tags including image:loc, image:title, and image:caption metadata for optimal Google image search indexing.
- **Robots.txt Optimization**: Relocated robots.txt from /api/robots to standard /robots.txt route. Added explicit Allow directives for all image directories (/images/blog/, /images/products/, etc.) and public API endpoints. Configured crawler-specific directives for all major search engines (Google, Bing, Yandex, Baidu) and social media crawlers (Facebook, Twitter, LinkedIn, WhatsApp).
- **Enhanced Metadata**: Updated layout.tsx with additional Open Graph images, richer keywords (AI image generator, generative AI, deep learning, computer vision), permissive robots directives (noimageindex: false), and multiple social media image tags with alt text.
- **Codebase Cleanup**: Removed obsolete /api/sitemap and /api/robots routes to maintain clean architecture and prevent duplicate sitemaps.
- **SEO Configuration**: All URLs now use dynamic domain detection (works seamlessly with localhost, Replit dev domain, Vercel, and custom production domains). Sitemap automatically updates with all blog posts from blog-data.ts.

### October 20, 2025 - Production Optimization & Initial SEO Setup
- **Dynamic Sitemap**: Implemented fully dynamic sitemap with automatic URL detection supporting Replit, Vercel, and custom domains. Automatically includes all blog posts from blog-data.ts.
- **Dynamic robots.txt**: Created with environment-aware domain detection and secure API endpoint blocking (/api/keys, /api/user/delete, /api/custom-apis, /dashboard).
- **SEO Foundation**: All hardcoded URLs replaced with dynamic detection. Created lib/site-url.ts utility for consistent URL generation across the application. Updated metadata, OpenGraph tags, and JSON-LD structured data.
- **Deployment Configuration**: Configured autoscale deployment for production with proper build and run commands.
- **Firebase Setup**: Prepared environment for Firebase secrets integration via Replit secrets manager.

### October 19, 2025
- **Avatar System**: Replaced static random avatars with Google profile pictures from Firebase authentication. Users now see their Google account photo throughout the application.
- **Next.js Configuration**: Removed invalid `allowedDevOrigins` experimental flag and added Google profile picture domains to remote image patterns for proper image loading.
- **Animation Component**: Enhanced AdaptiveAnimation component with better SSR handling and hydration warning suppression (note: minor hydration warning from framer-motion is expected and does not affect functionality).

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components are developed with Radix UI and styled using Tailwind CSS, featuring custom theming for responsive design with dark/light modes. Firebase is the chosen backend, providing authentication via Google OAuth and utilizing Firestore as the NoSQL database for data storage. The system integrates Google Analytics for tracking and includes features like user authentication, blog functionality, contact forms, newsletter sign-ups, an API proxy gateway, and a user dashboard. All data persistence for forms, API keys, and custom API configurations is handled by Firebase Firestore.

### API Usage Policy
The `/api/generate` endpoint is designed for unlimited requests with minimal database overhead:
- **No request logging**: Individual API requests are NOT saved to the database
- **No tracking**: Prompts, dimensions, or generation details are NOT stored
- **Lightweight validation**: API keys are validated against Firestore but no usage data is persisted
- **Unlimited requests**: Users can make unlimited API calls without database writes

### User Data Management
When a user deletes their account:
- All user data is automatically cleaned up from Firestore
- Deleted data includes: profile, API keys, custom APIs, and any associated records
- User deletion endpoint: `DELETE /api/user/delete` with `x-user-id` header

## External Dependencies
- **Firebase**: Provides authentication (Firebase Auth with Google OAuth) and database services (Firebase Firestore). The Firebase Admin SDK is used for server-side operations.
- **Next.js**: The primary web framework for the application.
- **Radix UI**: Used for accessible, unstyled UI components.
- **Tailwind CSS**: Employed for utility-first styling.
- **Google Analytics**: Integrated for tracking and analytics purposes.