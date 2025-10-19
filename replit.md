# Alexzo - AI-Powered Platform

## Overview
Alexzo is an AI-powered platform built with Next.js, designed to transform ideas using advanced AI technology. It offers a modern interface for interacting with AI capabilities, including user authentication, a dashboard, and content management. The project aims to pioneer the future of AI-powered human enhancement.

## User Preferences
I prefer iterative development, with a focus on clear and concise communication. Please ask before making major architectural changes or introducing new dependencies. I value detailed explanations when complex topics are discussed but prefer straightforward answers for routine tasks. Ensure all solutions are robust, scalable, and maintainable.

## System Architecture
The application is built using Next.js 15.2.4 with TypeScript. UI components are developed with Radix UI and styled using Tailwind CSS, featuring custom theming for responsive design with dark/light modes. Firebase is the chosen backend, providing authentication via Google OAuth and utilizing Firestore as the NoSQL database for data storage. The system integrates Google Analytics for tracking and includes features like user authentication, blog functionality, contact forms, newsletter sign-ups, an API proxy gateway, and a user dashboard. All data persistence for forms, API keys, and custom API configurations is handled by Firebase Firestore.

### API Usage Tracking
The `/api/generate` endpoint automatically saves minimal metadata to Firestore's `api_usage` collection for successful requests only:
- **User Details**: userId, userName, userEmail
- **API Information**: apiKey, apiKeyName
- **Request Data**: prompt, width, height, model
- **Timestamp**: createdAt

**Important**: NO error information, image data, or URLs are saved to minimize server load and storage costs. Failed requests are not logged.

## External Dependencies
- **Firebase**: Provides authentication (Firebase Auth with Google OAuth) and database services (Firebase Firestore). The Firebase Admin SDK is used for server-side operations.
- **Next.js**: The primary web framework for the application.
- **Radix UI**: Used for accessible, unstyled UI components.
- **Tailwind CSS**: Employed for utility-first styling.
- **Google Analytics**: Integrated for tracking and analytics purposes.