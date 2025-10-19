# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js, designed to transform ideas using advanced AI technology. It offers a modern interface for interacting with AI capabilities, including user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## Recent Changes (October 19, 2025)
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