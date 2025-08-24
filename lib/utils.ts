import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a Next.js page URL for a given page name or route segment.
 * Handles basic normalization and lowercasing for common page names.
 * Example: createPageUrl('Destinations') => '/destinations'
 */
export function createPageUrl(page: string): string {
  // Remove spaces, lowercase, and replace with dashes if needed
  const normalized = page.trim().toLowerCase().replace(/\s+/g, '-');
  return `/${normalized}`;
}

// export { createPageUrl };
// ...existing code...