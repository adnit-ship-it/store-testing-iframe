import { computed } from 'vue'
import { useBrandingStore } from '~/stores/branding'
import { usePagesStore } from '~/stores/pagesStore'

/**
 * Utility function to get dynamic brand colors from the API
 * Falls back to static design tokens if branding is not loaded
 */
export function useBrandColors() {
  const brandingStore = useBrandingStore()
  
  const getBrandColors = () => {
    const brandColors = brandingStore.getBrandColors()
    
    if (brandColors) {
      return {
        backgroundColor: brandColors.background,
        bodyColor: brandColors.body,
        accentColor1: brandColors.accent1,
        accentColor2: brandColors.accent2,
      }
    }
    
    // Fallback to static design tokens
    return {
      backgroundColor: '#FDFAF6',
      bodyColor: '#000000',
      accentColor1: '#A75809',
      accentColor2: '#F8F2EC',
    }
  }
  
  return {
    getBrandColors,
    isBrandingLoaded: computed(() => !!brandingStore.branding)
  }
}

/**
 * Utility function to get brand logos from the API
 */
export function useBrandLogos() {
  const brandingStore = useBrandingStore()
  
  return {
    logoUrl: computed(() => brandingStore.getLogoUrl()),
    altLogoUrl: computed(() => brandingStore.getAltLogoUrl()),
    organizationName: computed(() => brandingStore.getOrganizationName()),
    isBrandingLoaded: computed(() => !!brandingStore.branding)
  }
}

/**
 * Utility function to get logo sizes from pages.json
 * @param context - The logo context: 'navbar', 'footer', 'loadingScreen', 'hero', 'contact', 'products'
 * @param dimension - 'height' or 'width'
 * @param isMobile - Whether the current viewport is mobile (optional, will be detected if not provided)
 * @param isTablet - Whether the current viewport is tablet (optional, will be detected if not provided)
 * @returns The size value as a string (e.g., "24px", "auto")
 */
export function getLogoSize(
  context: 'navbar' | 'footer' | 'loadingScreen' | 'hero' | 'contact' | 'products',
  dimension: 'height' | 'width',
  isMobile?: boolean,
  isTablet?: boolean
): string {
  const pagesStore = usePagesStore()
  const logoSizes = pagesStore.pages?.logoSizes
  
  if (!logoSizes || !logoSizes[context]) {
    // Fallback values
    const fallbacks: Record<string, Record<string, Record<string, string>>> = {
      navbar: { height: { mobile: '24px', tablet: '28px', desktop: '28px' }, width: { mobile: 'auto', tablet: 'auto', desktop: 'auto' } },
      footer: { height: { mobile: '20px', tablet: '26px', desktop: '32px' }, width: { mobile: 'auto', tablet: 'auto', desktop: 'auto' } },
      loadingScreen: { height: { mobile: '20px', desktop: '132px' }, width: { mobile: 'auto', desktop: 'auto' } },
      hero: { height: { mobile: '34px', tablet: '38px', desktop: '62px' }, width: { mobile: '192px', tablet: '280px', desktop: '365px' } },
      contact: { height: { mobile: '56px', tablet: '72px', desktop: '88px' }, width: { mobile: 'auto', tablet: 'auto', desktop: 'auto' } },
      products: { height: { mobile: '48px', tablet: '64px', desktop: '100px' }, width: { mobile: 'auto', tablet: 'auto', desktop: 'auto' } }
    }
    const contextConfig = fallbacks[context]?.[dimension]
    if (!contextConfig) return dimension === 'width' ? 'auto' : '24px'
    
    // Auto-detect if not provided
    if (isMobile === undefined || isTablet === undefined) {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        isMobile = width < 768
        isTablet = width >= 768 && width < 1024
      } else {
        return contextConfig.desktop || contextConfig.mobile || (dimension === 'width' ? 'auto' : '24px')
      }
    }
    
    if (isMobile) return contextConfig.mobile || contextConfig.desktop || (dimension === 'width' ? 'auto' : '24px')
    if (isTablet) return contextConfig.tablet || contextConfig.desktop || (dimension === 'width' ? 'auto' : '24px')
    return contextConfig.desktop || contextConfig.mobile || (dimension === 'width' ? 'auto' : '24px')
  }
  
  const contextConfig = logoSizes[context]
  const dimensionConfig = contextConfig[dimension]
  
  if (!dimensionConfig) {
    return dimension === 'width' ? 'auto' : '24px'
  }
  
  // Auto-detect if not provided
  if (isMobile === undefined || isTablet === undefined) {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      isMobile = width < 768
      isTablet = width >= 768 && width < 1024
    } else {
      // SSR fallback - return desktop or first available
      if (dimensionConfig.desktop) return dimensionConfig.desktop
      if (dimensionConfig.tablet) return dimensionConfig.tablet
      if (dimensionConfig.mobile) return dimensionConfig.mobile
      return dimension === 'width' ? 'auto' : '24px'
    }
  }
  
  // For loadingScreen, only mobile/desktop
  if (context === 'loadingScreen') {
    if (isMobile) return dimensionConfig.mobile || dimensionConfig.desktop || (dimension === 'width' ? 'auto' : '20px')
    return dimensionConfig.desktop || dimensionConfig.mobile || (dimension === 'width' ? 'auto' : '132px')
  }
  
  // For other contexts, use mobile/tablet/desktop
  if (isMobile) return dimensionConfig.mobile || dimensionConfig.tablet || dimensionConfig.desktop || (dimension === 'width' ? 'auto' : '24px')
  if (isTablet) return dimensionConfig.tablet || dimensionConfig.desktop || dimensionConfig.mobile || (dimension === 'width' ? 'auto' : '24px')
  return dimensionConfig.desktop || dimensionConfig.tablet || dimensionConfig.mobile || (dimension === 'width' ? 'auto' : '24px')
}