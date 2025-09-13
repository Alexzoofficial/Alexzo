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
- ✅ Next.js development server configured for Replit environment with proper host allowlist
- ✅ Frontend workflow running on port 5000
- ✅ Application compiling and serving successfully
- ✅ Deployment configuration set up for autoscale production deployment
- ✅ Supabase environment variables configured and working
- ✅ Security vulnerabilities resolved (hardcoded credentials removed)
- ✅ TypeScript configuration properly set up with Node.js types
- ✅ GitHub import successfully completed and ready for use

## Recent Changes
- **2025-09-13**: Fresh GitHub import setup completed for Replit environment
  - Fixed security vulnerability by removing hardcoded Supabase credentials
  - Installed Node.js dependencies with legacy peer deps flag to resolve React version conflicts
  - Fixed TypeScript configuration by adding Node.js types to resolve LSP errors
  - Set up proper Supabase environment variables using Replit Secrets management
  - Configured development server for Replit (0.0.0.0:5000) with proper host allowlist
  - Set up and started frontend workflow successfully
  - Configured deployment settings for autoscale deployment
  - Application successfully running and compiling without errors
  - Verified all functionality is working correctly

## Supabase Configuration
✅ **Supabase integration fully working and configured!**
- `NEXT_PUBLIC_SUPABASE_URL` ✅ Configured and working
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ Configured and working  
- `SUPABASE_SERVICE_ROLE_KEY` ✅ Configured for server-side operations
- Environment constants properly loaded via `lib/public-env.ts` module
- Client-side and server-side integration confirmed working
- Authentication context successfully initializing with Supabase client
- Google OAuth, user profiles, and database operations ready

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