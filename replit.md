# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js, designed to transform ideas using advanced AI technology. It offers a modern interface for interacting with AI capabilities, including user authentication and content management. The platform features two core products: Zyfoox (AI image generation) and LearnFlow (AI-powered learning). The project aims to pioneer the future of AI-powered human enhancement.

## Recent Changes

### October 20, 2025 - Blog Images & WebP Conversion
- **Blog Image Restoration**: Generated and added 3 missing blog images in WebP format for optimal performance and SEO.
  - Created ai-image-generation-tech.webp for AI technology blog post
  - Created alexzo-ai-revolution.webp for company story blog post
  - Created learnflow-education.webp for education platform blog post
- **WebP Optimization**: All blog images now use WebP format (90% quality) for better compression and faster loading.
- **Image Format Support**: Updated lib/blog-data.ts to reference .webp files instead of .jpg extensions.
- **Footer Enhancement**: Added "Showcase" link to Company section in footer for better navigation.
- **Next.js Optimization**: Added sizes prop to blog images to eliminate performance warnings and improve responsive image loading.
- **Fallback System**: Created public/placeholder.svg for graceful image fallback handling.
- **Right-Click Support**: All images support standard browser context menu (right-click, long-press, share functionality).

### October 20, 2025 - Major Cleanup & Optimization
- **Route Cleanup**: Permanently removed /dashboard page and all references to it from sitemap, robots.txt, and documentation.
- **Image Optimization**: Removed all unused blog images (17 files) from public/images/blog/ directory. Retained only 4 essential product images: alexis-ai.png, image-generator.png, video-generator.png, and zyfoox-interface.png.
- **Showcase Redesign**: Completely rebuilt /showcase page with updated product data focusing solely on Zyfoox and LearnFlow. Implemented fully responsive design for both mobile and desktop with improved UI/UX, statistics display, and comprehensive comparison tables.
- **Sitemap Update**: Cleaned up sitemap.xml by removing /dashboard and /showcase references, eliminated all blog image references since those assets no longer exist.
- **Robots.txt Update**: Removed /dashboard disallow directive and /images/blog/ allow directive to reflect current site structure.
- **Codebase Streamlining**: Focused product offering on two core products (Zyfoox and LearnFlow), removing references to video and voice generation products from showcase comparisons.

### October 20, 2025 - Comprehensive SEO Enhancement & Image Indexing
- **Image Sitemap Implementation**: Enhanced sitemap.xml with Google Image Sitemap schema for optimal Google image search indexing.
- **Robots.txt Optimization**: Relocated robots.txt from /api/robots to standard /robots.txt route. Configured crawler-specific directives for all major search engines and social media crawlers.
- **Enhanced Metadata**: Updated layout.tsx with additional Open Graph images and richer keywords.
- **SEO Configuration**: All URLs now use dynamic domain detection (works seamlessly with localhost, Replit dev domain, Vercel, and custom production domains).

### October 20, 2025 - Production Optimization & Initial SEO Setup
- **Dynamic Sitemap**: Implemented fully dynamic sitemap with automatic URL detection supporting Replit, Vercel, and custom domains.
- **Dynamic robots.txt**: Created with environment-aware domain detection and secure API endpoint blocking.
- **SEO Foundation**: All hardcoded URLs replaced with dynamic detection. Created lib/site-url.ts utility for consistent URL generation.
- **Deployment Configuration**: Configured autoscale deployment for production with proper build and run commands.
- **Firebase Setup**: Prepared environment for Firebase secrets integration via Replit secrets manager.

### October 19, 2025
- **Avatar System**: Replaced static random avatars with Google profile pictures from Firebase authentication. Users now see their Google account photo throughout the application.
- **Next.js Configuration**: Removed invalid `allowedDevOrigins` experimental flag and added Google profile picture domains to remote image patterns for proper image loading.
- **Animation Component**: Enhanced AdaptiveAnimation component with better SSR handling and hydration warning suppression (note: minor hydration warning from framer-motion is expected and does not affect functionality).

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components are developed with Radix UI and styled using Tailwind CSS, featuring custom theming for responsive design with dark/light modes. Firebase is the chosen backend, providing authentication via Google OAuth and utilizing Firestore as the NoSQL database for data storage. The system integrates Google Analytics for tracking and includes features like user authentication, blog functionality, contact forms, newsletter sign-ups, and an API proxy gateway. All data persistence for forms, API keys, and custom API configurations is handled by Firebase Firestore.

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