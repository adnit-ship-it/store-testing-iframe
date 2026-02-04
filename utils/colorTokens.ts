/**
 * Color Token Resolution Utilities
 * 
 * Converts color token strings to Tailwind classes and resolves hex values
 * for SVG/icon components. Automatically reads colors from tailwind.config.js
 */

// Import Tailwind config to get colors dynamically
import tailwindConfig from '../tailwind.config.js'

// Extract base color hex values from tailwind.config.js
// Handle both string values and object values (like accentColor1 with DEFAULT)
const getColorValue = (colorValue: any): string => {
  if (!colorValue) return ''
  if (typeof colorValue === 'string') return colorValue
  if (typeof colorValue === 'object' && colorValue.DEFAULT) return colorValue.DEFAULT
  return ''
}

// Safely access colors from tailwind config with type assertion
const tailwindColors = (tailwindConfig.theme?.extend?.colors as any) || {}
const BASE_COLORS = {
  backgroundColor: getColorValue(tailwindColors['backgroundColor']) || '#F5F3ED',
  bodyColor: getColorValue(tailwindColors['bodyColor']) || '#4A4A4A',
  accentColor1: getColorValue(tailwindColors['accentColor1']) || '#750021',
  accentColor2: getColorValue(tailwindColors['accentColor2']) || '#A97585',
} as const

// Extended colors (if needed)
const EXTENDED_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
} as const

// All supported color tokens
const ALL_COLORS = {
  ...BASE_COLORS,
  ...EXTENDED_COLORS,
} as const

type ColorPrefix = 'text' | 'bg' | 'border'
type BaseColorToken = keyof typeof BASE_COLORS
type ExtendedColorToken = keyof typeof EXTENDED_COLORS
type ColorToken = BaseColorToken | ExtendedColorToken | string

const isDev = import.meta.dev

/**
 * Resolves a color token to a Tailwind class
 * @param token - Color token string (e.g., "bodyColor", "accentColor1", "#A75809")
 * @param prefix - Tailwind class prefix ('text', 'bg', or 'border')
 * @returns Tailwind class string (e.g., "text-bodyColor") or hex value for inline styles
 */
export function resolveColorToken(
  token: string | null | undefined,
  prefix: ColorPrefix = 'text'
): string {
  // Handle null/undefined
  if (!token) {
    if (isDev) {
      console.warn(`[colorTokens] Empty token provided, returning empty string`)
    }
    return ''
  }

  // If it's a hex value, return as-is for inline styles
  if (token.startsWith('#')) {
    return token
  }

  // Check if it's a base color
  if (token in BASE_COLORS) {
    return `${prefix}-${token}`
  }

  // Check if it's an extended color
  if (token in EXTENDED_COLORS) {
    return `${prefix}-${token}`
  }

  // Unknown token - log warning in dev mode
  if (isDev) {
    console.warn(
      `[colorTokens] Unknown color token: "${token}". Returning empty string.`
    )
  }

  return ''
}

/**
 * Resolves a background color token to a Tailwind class
 * @param token - Color token string
 * @returns Tailwind background class (e.g., "bg-accentColor1") or Tailwind arbitrary value (e.g., "bg-[#ff0000]")
 */
export function resolveBackgroundColor(
  token: string | null | undefined
): string {
  // Handle null/undefined
  if (!token) {
    if (isDev) {
      console.warn(`[colorTokens] Empty background color token, returning empty string`)
    }
    return ''
  }

  // If it's a hex value, format it as Tailwind arbitrary value
  if (token.startsWith('#')) {
    return `bg-[${token}]`
  }

  // Check if it's a base color
  if (token in BASE_COLORS) {
    return `bg-${token}`
  }

  // Check if it's an extended color
  if (token in EXTENDED_COLORS) {
    return `bg-${token}`
  }

  // For unknown tokens (like "green", "red"), use Tailwind arbitrary value with CSS color name
  // This allows any CSS color name to work
  if (isDev) {
    console.warn(
      `[colorTokens] Unknown background color token: "${token}". Using Tailwind arbitrary value.`
    )
  }
  
  return `bg-[${token}]`
}

/**
 * Resolves an icon color token to a hex value for SVG components
 * @param token - Color token string or hex value
 * @returns Hex color value (e.g., "#750021")
 */
export function resolveIconColor(token: string | null | undefined): string {
  // Handle null/undefined
  if (!token) {
    if (isDev) {
      console.warn(`[colorTokens] Empty icon color token, using default accentColor1`)
    }
    return BASE_COLORS.accentColor1
  }

  // If it's already a hex value, return as-is
  if (token.startsWith('#')) {
    return token
  }

  // Check if it's a base color
  if (token in BASE_COLORS) {
    return BASE_COLORS[token as BaseColorToken]
  }

  // Check if it's an extended color
  if (token in EXTENDED_COLORS) {
    return EXTENDED_COLORS[token as ExtendedColorToken]
  }

  // Unknown token - log warning and return default
  if (isDev) {
    console.warn(
      `[colorTokens] Unknown icon color token: "${token}". Using default accentColor1.`
    )
  }

  return BASE_COLORS.accentColor1
}

/**
 * Recursively extracts icon colors from nested data structures
 * @param data - Data object to search for icon colors
 * @param path - Current path in the data structure (for debugging)
 * @param maxDepth - Maximum recursion depth (default: 10)
 * @returns Record mapping paths to color tokens/values
 */
export function extractIconColors(
  data: any,
  path: string = '',
  maxDepth: number = 10,
  currentDepth: number = 0
): Record<string, string> {
  const iconColors: Record<string, string> = {}

  // Safety check for recursion depth
  if (currentDepth >= maxDepth) {
    if (isDev) {
      console.warn(
        `[colorTokens] Maximum recursion depth (${maxDepth}) reached at path: ${path}`
      )
    }
    return iconColors
  }

  // Handle null/undefined
  if (data === null || data === undefined) {
    return iconColors
  }

  // Handle arrays
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = path ? `${path}[${index}]` : `[${index}]`
      const nestedColors = extractIconColors(
        item,
        itemPath,
        maxDepth,
        currentDepth + 1
      )
      Object.assign(iconColors, nestedColors)
    })
    return iconColors
  }

  // Handle objects
  if (typeof data === 'object') {
    // Check if this object has an icon with a color property
    if (data.icon && typeof data.icon === 'object' && data.icon.color) {
      const colorPath = path ? `${path}.icon.color` : 'icon.color'
      iconColors[colorPath] = data.icon.color
    }

    // Recursively search nested objects
    Object.keys(data).forEach((key) => {
      const value = data[key]
      const newPath = path ? `${path}.${key}` : key

      // Skip if we already processed this as icon.color
      if (key === 'icon' && typeof value === 'object' && value.color) {
        return
      }

      // Recursively search
      if (typeof value === 'object' && value !== null) {
        const nestedColors = extractIconColors(
          value,
          newPath,
          maxDepth,
          currentDepth + 1
        )
        Object.assign(iconColors, nestedColors)
      }
    })
  }

  return iconColors
}

/**
 * Gets the hex value for a base color token
 * @param token - Base color token name
 * @returns Hex color value or null if not found
 */
export function getBaseColorHex(token: BaseColorToken): string | null {
  return BASE_COLORS[token] || null
}

/**
 * Checks if a token is a valid base color
 * @param token - Color token to check
 * @returns True if token is a base color
 */
export function isBaseColor(token: string): token is BaseColorToken {
  return token in BASE_COLORS
}


