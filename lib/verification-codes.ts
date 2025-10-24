/**
 * VERIFICATION CODES CONFIGURATION FILE
 * 
 * IMPORTANT: Is file ko kabhi delete na karein!
 * This file contains all website verification codes for different services.
 * Yahan verification codes safely store hote hain.
 * 
 * Add new verification codes here as needed.
 */

export const verificationCodes = {
  // Google Search Console Verification Codes
  google: [
    "google7cb025440a4403af",  // Existing verification code
    "LciVAzACk6a_cqUyi_rfYQqgsrX5AUuiWbsCLg5mOs0"  // New verification code
  ],
  
  // Bing Webmaster Tools (add when needed)
  bing: "",
  
  // Yandex Webmaster (add when needed)
  yandex: "",
  
  // Pinterest Site Verification (add when needed)
  pinterest: "",
  
  // Other verification codes can be added here
  // Example:
  // facebook: "your-facebook-domain-verification",
  // norton: "your-norton-verification",
}

// Helper function to get all Google verification codes
export function getGoogleVerificationCodes(): string[] {
  return verificationCodes.google.filter(code => code && code.trim() !== "")
}

// Helper function to get primary Google verification code
export function getPrimaryGoogleVerification(): string {
  return verificationCodes.google[0] || ""
}
