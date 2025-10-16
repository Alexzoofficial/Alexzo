# Fixing Firebase Social Login on Vercel Deployment

## Issue Overview
Firebase social login works on Replit but fails on Vercel deployment. This guide provides step-by-step solutions for the most common causes.

## Part 1: Environment Variables Setup in Vercel

### Step 1: Access Vercel Project Settings
1. Go to [vercel.com](https://vercel.com) and log in
2. Navigate to your project dashboard
3. Click on your project name
4. Go to **Settings** tab
5. Click **Environment Variables** from the left sidebar

### Step 2: Add Firebase Environment Variables
Add each of the following environment variables **exactly as shown**:

**Variable Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
**Value:** `[Your Firebase API Key from Firebase Console]`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
**Value:** `[your-project-id].firebaseapp.com`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
**Value:** `https://[your-project-id]-default-rtdb.firebaseio.com`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
**Value:** `[your-project-id]`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
**Value:** `[your-project-id].appspot.com`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
**Value:** `[your-messaging-sender-id]`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_APP_ID`
**Value:** `[your-app-id]`
**Environment:** Production, Preview, Development (check all three)

**Variable Name:** `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
**Value:** `[your-measurement-id]`
**Environment:** Production, Preview, Development (check all three)

### Step 3: Save and Redeploy
1. Click **Save** for each environment variable
2. Go to **Deployments** tab
3. Find your latest deployment and click the **...** menu
4. Click **Redeploy** to trigger a new deployment with the environment variables

## Part 2: Firebase Console Configuration

### Step 1: Access Firebase Console
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your Firebase project

### Step 2: Add Authorized Domains
1. In the left sidebar, click **Authentication**
2. Click **Settings** tab at the top
3. Scroll down to **Authorized domains** section
4. Click **Add domain**

### Step 3: Add Your Vercel Domains
Add these domains one by one (replace `your-project-name` with your actual Vercel project name):

**Required Domains:**
- `your-project-name.vercel.app` (production domain)
- `your-project-name-git-main-your-username.vercel.app` (main branch preview)

**⚠️ Important Notes:**
- Firebase does NOT support wildcard domains like `*.vercel.app`
- Each domain must be added individually and exactly
- Preview deployment URLs change with each commit, so consider using a stable preview strategy

**Find Your Exact Domains:**
1. Go to your Vercel project dashboard
2. In the **Deployments** tab, copy the exact URLs from your deployments
3. Add each unique domain to Firebase (without `https://`)
4. For preview deployments, consider setting up a stable preview domain in Vercel settings

### Step 4: Environment Configuration Notes

**Vercel Environment Scopes Explained:**
- **Production**: Used for your main domain (your-project-name.vercel.app)
- **Preview**: Used for branch deployments and pull request previews
- **Development**: Used when running `vercel dev` locally

**💡 Tip**: Set all environment variables to all three scopes to ensure consistent behavior across environments.

## Part 3: Common Issues & Troubleshooting

### Issue 1: "Firebase not configured" Error
**Symptoms:** Console shows "Firebase not configured - authentication unavailable"
**Solution:**
1. Verify all environment variables are set correctly in Vercel
2. Check variable names have `NEXT_PUBLIC_` prefix
3. Redeploy after adding variables

### Issue 2: "Pop-up blocked" Error
**Symptoms:** Users see popup blocked messages
**Solution:** See Part 4 below for popup fallback implementation

### Issue 3: "Unauthorized domain" Error
**Symptoms:** Authentication fails with domain errors
**Solution:**
1. Check Firebase console authorized domains include your Vercel URLs
2. Ensure all your specific Vercel domains are added to Firebase authorized domains
3. Wait 5-10 minutes for changes to propagate

### Issue 4: Environment Variables Not Loading
**Symptoms:** `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` is undefined
**Solution:**
1. Check environment variable names are exact (case-sensitive)
2. Ensure all three environments are selected (Production, Preview, Development)
3. Redeploy after adding variables

## Part 4: Testing Your Setup

### Step 1: Check Environment Variables
1. Deploy your app to Vercel
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)`
5. Should show your Firebase API key (not undefined)
6. If undefined, environment variables weren't set correctly - revisit Part 1

### Step 2: Test Authentication
1. Open your Vercel-deployed app
2. Try to sign in with Google
3. Check browser console for any errors
4. If popup is blocked, users should see helpful error message

### Step 3: Verify Firebase Connection
1. In browser console, type: `firebase.apps`
2. Should show your initialized Firebase app
3. No errors should appear in the console

## Part 5: Emergency Checklist

If authentication still doesn't work, verify:

- [ ] All 8 environment variables are set in Vercel
- [ ] All environments (Production, Preview, Development) are checked
- [ ] Project has been redeployed after adding variables
- [ ] Vercel domain is added to Firebase authorized domains
- [ ] All specific Vercel domains are added to Firebase authorized domains
- [ ] Browser allows popups for your domain
- [ ] Firebase project is active and not suspended

## Support Notes

**Environment Variable Format:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=[Your Firebase API Key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[your-project-id].firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[your-project-id]
# etc...
```

**Example Vercel URLs to Add to Firebase:**
- `my-app.vercel.app` (production)
- `my-app-git-main-johndoe.vercel.app` (main branch preview)
- Individual commit preview URLs (only add if needed for testing)

**💡 Best Practice**: Focus on production domain + one stable preview domain to keep your Firebase authorized domains list manageable.

If you're still experiencing issues after following this guide, the problem may be related to:
1. Firebase project billing/quota limits
2. Vercel deployment region restrictions
3. Browser-specific security policies

**Still Having Issues?**

1. **Double-check storage bucket**: Ensure it's `[your-project-id].appspot.com` (not .firebasestorage.app)
2. **Verify exact domain spelling**: Copy domains directly from Vercel dashboard
3. **Wait for propagation**: Firebase changes can take 5-10 minutes to take effect
4. **Check browser console**: Look for specific Firebase error messages
5. **Test in incognito mode**: Eliminates cached authentication issues

If authentication still fails, the issue may be project-specific (billing, quotas, or regional restrictions).