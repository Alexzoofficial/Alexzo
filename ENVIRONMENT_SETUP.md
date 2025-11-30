# Environment Setup for Firebase Admin SDK

This project uses the Firebase Admin SDK for server-side operations, which requires proper configuration of environment variables to authenticate with your Firebase project. Failure to configure these variables will result in errors like "Authentication service is not configured on the server" when trying to use features like API key generation.

## Required Environment Variables

You need to set the following environment variables:

-   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project's unique ID.
-   `FIREBASE_CLIENT_EMAIL`: The client email associated with your Firebase service account.
-   `FIREBASE_PRIVATE_KEY`: The private key for your Firebase service account.

---

## Generating Firebase Service Account Credentials

To get the values for the variables above, you need to generate a private key file from your Firebase project settings:

1.  **Navigate to your Firebase Project Settings:**
    *   Open the [Firebase Console](https://console.firebase.google.com/).
    *   Select the Firebase project you are using for this application.
    *   Click the gear icon next to "Project Overview" and select **Project settings**.

2.  **Go to the Service Accounts Tab:**
    *   In the Project settings, click on the **Service accounts** tab.

3.  **Generate a New Private Key:**
    *   You will see a section for the Firebase Admin SDK.
    *   Click the **Generate new private key** button. A confirmation dialog will appear.
    *   Click **Generate key**. A JSON file containing your service account credentials will be downloaded.

4.  **Extract the Required Values:**
    *   Open the downloaded JSON file. You will find the following key-value pairs:
        *   `"project_id"`: The value for `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
        *   `"client_email"`: The value for `FIREBASE_CLIENT_EMAIL`.
        *   `"private_key"`: The value for `FIREBASE_PRIVATE_KEY`.

    **Important:** Keep this JSON file and your private key secure. Do not commit it to your Git repository.

---

## Configuration for Production (Vercel)

For your deployed application on Vercel to work correctly, you must add the environment variables directly to your Vercel project settings:

1.  **Go to your Vercel Project:**
    *   Open your project dashboard on Vercel.

2.  **Navigate to Environment Variables Settings:**
    *   Click the **Settings** tab.
    *   In the side menu, click on **Environment Variables**.

3.  **Add the Variables:**
    *   Create three new environment variables with the keys:
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        *   `FIREBASE_CLIENT_EMAIL`
        *   `FIREBASE_PRIVATE_KEY`
    *   For each variable, copy and paste the corresponding value you extracted from the JSON file.
    *   Ensure the variables are available for the **Production** environment (and Preview/Development if needed).

4.  **Redeploy:**
    *   After adding the variables, you will need to redeploy your project for the changes to take effect.

---

## Configuration for Local Development

To run the application and its server-side features locally, you should use a `.env.local` file.

1.  **Create a `.env.local` File:**
    *   In the root directory of the project, create a new file named `.env.local`.

2.  **Add the Variables:**
    *   Add the following lines to the `.env.local` file, replacing the placeholder values with the credentials from your JSON file:

    ```bash
    # Firebase Admin SDK Credentials
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
    FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n"
    ```

    **Note on `FIREBASE_PRIVATE_KEY`:** The private key in the JSON file contains newline characters (`\n`). When adding it to `.env.local` or Vercel, you must ensure these are preserved. In most cases, you can paste the key as-is within double quotes.

3.  **Restart the Development Server:**
    *   If your development server is running, stop it and restart it (`npm run dev`) to load the new environment variables.

Your server-side Firebase features should now work correctly in your local environment.
