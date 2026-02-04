import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content using DOMPurify
 * @param htmlString - The HTML string to sanitize
 * @param options - DOMPurify configuration options
 * @returns Clean, sanitized text content
 */
export const sanitizeHtml = (
  htmlString: string, 
  options: {
    allowedTags?: string[]
    allowedAttributes?: string[]
  } = {}
): string => {
  if (!htmlString) return ''
  
  const defaultOptions = {
    ALLOWED_TAGS: options.allowedTags || [],
    ALLOWED_ATTR: options.allowedAttributes || []
  }
  
  return DOMPurify.sanitize(htmlString, defaultOptions)
}

/**
 * Sanitizes HTML content and extracts only text content
 * @param htmlString - The HTML string to sanitize
 * @returns Clean text content without HTML tags
 */
export const sanitizeText = (htmlString: string): string => {
  return sanitizeHtml(htmlString, { allowedTags: [] })
}

/**
 * Sanitizes HTML content allowing only basic formatting tags
 * @param htmlString - The HTML string to sanitize
 * @returns Clean HTML with basic formatting
 */
export const sanitizeBasicHtml = (htmlString: string): string => {
  return sanitizeHtml(htmlString, {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'span'],
    allowedAttributes: ['style', 'class']
  })
} 