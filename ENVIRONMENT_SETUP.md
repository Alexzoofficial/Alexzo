# Environment Setup for Firebase Admin

For server-side features like API key validation and other backend operations to function correctly, this project requires credentials for a Firebase Admin service account.

Follow these steps to configure your local environment.

## 1. Obtain Firebase Service Account Credentials

You need to get a private key file from your Firebase project.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Click the gear icon next to **Project Overview** in the sidebar and select **Project settings**.
4.  Go to the **Service accounts** tab.
5.  Click the **Generate new private key** button. A JSON file will be downloaded.

**Warning:** Keep this file secure and do not commit it to version control.

## 2. Create a `.env.local` file

In the root directory of this project, create a file named `.env.local`.

## 3. Add Environment Variables

Open the downloaded JSON file. It will contain several key-value pairs. You will need the following values:
- `project_id`
- `client_email`
- `private_key`

Now, open your `.env.local` file and add the following lines, replacing the placeholder values with the ones from your JSON file:

```bash
# Firebase Admin Credentials
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"
```

**Important Notes:**

- The `private_key` in the JSON file will contain `\n` characters for newlines. It's crucial to copy the entire string exactly as it appears. The application is configured to handle these characters correctly.
- The `.env.local` file is included in `.gitignore` by default and should **never** be committed to your repository.

Once you have created and populated the `.env.local` file, you can restart the development server, and the server-side Firebase features should now work as expected.
