import { NextRequest } from 'next/server';

/**
 * Extracts the real IP address from a NextRequest object.
 * It checks common proxy headers in order of reliability.
 *
 * @param request The NextRequest object.
 * @returns The client's IP address or 'unknown' if not found.
 */
export function getUserIP(request: Request): string {
  // Check common proxy headers in order of reliability
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first (original client)
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to "unknown" if no IP headers found
  return "unknown";
}
