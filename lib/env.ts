// Secure environment variable handling

// Get environment variables with fallbacks
export function getEnv(key: string, defaultValue = ""): string {
  // For client-side variables, they must be prefixed with NEXT_PUBLIC_
  if (typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`Environment variable ${key} is being accessed on the client side but doesn't start with NEXT_PUBLIC_`)
    return defaultValue
  }

  return process.env[key] || defaultValue
}

// Validate required environment variables
export function validateEnv(requiredVars: string[]): boolean {
  const missing = requiredVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`)
    return false
  }

  return true
}
