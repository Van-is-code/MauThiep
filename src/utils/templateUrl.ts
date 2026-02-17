/**
 * Template URL Resolver
 * Handles different URL schemes for development vs production
 * 
 * - Development: Direct file paths (via Vite plugin)
 * - Production (Vercel): Direct static paths (public folder is served automatically)
 * - Fallback: API endpoint for safety
 */

export const getTemplateUrl = (templatePath: string): string => {
  // Ensure path starts with /
  const normalizedPath = templatePath.startsWith('/') ? templatePath : `/${templatePath}`

  // Development: Use direct paths (Vite plugin handles it)
  if (import.meta.env.DEV) {
    return normalizedPath
  }

  // Production: Use direct paths (Vercel serves public folder automatically)
  // If template file is at public/templates/T01/..., URL is /templates/T01/...
  return normalizedPath
}

/**
 * Get image URL
 */
export const getImageUrl = (imagePath: string): string => {
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  
  if (import.meta.env.DEV) {
    return normalizedPath
  }

  return normalizedPath
}

/**
 * Fallback API endpoint (if direct serving fails)
 */
export const getTemplateApiUrl = (templatePath: string): string => {
  const normalizedPath = templatePath.startsWith('/') ? templatePath : `/${templatePath}`
  const encodedPath = encodeURIComponent(normalizedPath)
  return `/api/template?url=${encodedPath}`
}

/**
 * Retry mechanism: Try direct URL first, fallback to API
 */
export const createTemplateFallbackUrl = (templatePath: string): {
  primary: string
  fallback: string
} => {
  const primary = getTemplateUrl(templatePath)
  const fallback = getTemplateApiUrl(templatePath)

  return { primary, fallback }
}

export default {
  getTemplateUrl,
  getImageUrl,
  getTemplateApiUrl,
  createTemplateFallbackUrl,
}
