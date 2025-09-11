# Alexzo - AI-Powered Platform

## Overview
This is a Next.js application called "Alexzo" - an AI-powered platform that transforms ideas with cutting-edge AI technology. The project has been successfully set up to run in the Replit environment.

## Project Architecture
- **Framework**: Next.js 15.2.4 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **Authentication**: Supabase (with demo mode fallback)
- **Styling**: Tailwind CSS with custom theming
- **Analytics**: Google Analytics integration
- **Development Server**: Running on port 5000 with 0.0.0.0 binding

## Current State
- ✅ Dependencies installed with `--legacy-peer-deps` to resolve React version conflicts
- ✅ Next.js development server configured for Replit environment
- ✅ Frontend workflow running on port 5000
- ✅ Application compiling and serving successfully
- ✅ Deployment configuration set up for production
- ✅ Supabase environment variables configured and working

## Recent Changes
- **2025-09-11**: Completed GitHub import setup for Replit environment
  - Installed Node.js dependencies with legacy peer deps flag
  - Fixed Next.js configuration by removing invalid experimental options
  - Simplified CORS configuration for API routes
  - Configured development server for Replit (0.0.0.0:5000)
  - Set up workflow for frontend development
  - Configured deployment settings for autoscale deployment
  - Application successfully running and compiling without errors

## Supabase Configuration
The app includes Supabase integration with properly configured environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` ✅ Configured
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ Configured
- `SUPABASE_SERVICE_ROLE_KEY` ✅ Configured

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