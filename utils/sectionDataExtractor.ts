/**
 * Section Data Extractor
 * 
 * Extracts and normalizes ALL data from sections.json structure
 * for component consumption. NO FALLBACKS - returns null/empty if data missing.
 */

import type { SectionData } from '~/stores/pagesStore'
import { extractIconColors } from './colorTokens'

const isDev = import.meta.dev

/**
 * Extracted and normalized section data structure
 */
export interface ExtractedSectionData {
  // Text content
  heading?: {
    text: string
    color: string
    show: boolean
  }
  subheading?: {
    text: string
    color: string
    show: boolean
  }
  paragraph?: {
    text: string
    color: string
    show: boolean
  }
  
  // Buttons
  ctaButton?: {
    text: string
    color: string
    backgroundColor?: string
    show: boolean
  }
  button?: {
    text: string
    color: string
    backgroundColor?: string
    show: boolean
  }
  // Buttons array - preferred format for multiple buttons
  buttons?: Array<{
    text: string
    color: string
    backgroundColor?: string
    show: boolean
  }>
  // Legacy button1/button2 - kept for backwards compatibility
  button1?: {
    text: string
    color: string
    backgroundColor?: string
    show: boolean
  }
  button2?: {
    text: string
    color: string
    backgroundColor?: string
    show: boolean
  }
  
  // Media assets
  logo?: {
    src: string
    alt: string
    type?: string
    sizes?: {
      mobile?: string
      tablet?: string
      desktop?: string
    }
    show: boolean
  }
  media?: {
    background?: {
      src: string
      alt: string
    }
    foreground?: {
      src: string
      alt: string
      sizes?: {
        mobile?: string
        tablet?: string
        desktop?: string
      }
    }
    image?: {
      src: string
      alt: string
      type?: string
      show?: boolean
    }
    product?: {
      src: string
      alt: string
    }
    avatar?: {
      src: string
      alt: string
      color?: string
    }
    star?: {
      src: string
      alt: string
      color?: string
    }
    progressLine?: {
      color: string
    }
    graph?: {
      src: string
      alt: string
    }
  }
  
  // Component-specific configs
  marqueeSpeed?: number
  productCard?: {
    type: string
    productBundleId?: string
    productId?: string
    button?: {
      text: string
      type: string
      color: string
      show: boolean
    }
  }
  
  // Bullet points
  bulletPoints?: {
    show: boolean
    type: string
    icon: {
      src: string
      color: string
    }
    items: string[]
  }
  
  // Journey steps
  steps?: Array<{
    title: string
    subtext: string
    icon: {
      src: string
      alt: string
      type: string
      color: string
    }
    order: number
  }>
  
  // Before/After images
  beforeAfter?: Array<{
    image: {
      src: string
      alt: string
      type: string
      stars?: number
      testimonial?: string
      name?: string
      order: number
    }
  }>
  
  // FAQ items
  faq?: Array<{
    question: string
    answer: string
    order: number
  }>
  
  // Stats
  stats?: {
    patients?: string
    worldwideCare?: string
  }
  
  // Info cards
  infoCard?: {
    type: string
    show: boolean
    title: string
    description: string
  }
  'infoCard with bulletpoint'?: {
    type: string
    show: boolean
    title: string
    description: string
    bulletpoints: Array<{
      text: string
      showIcon: boolean
    }>
    bulletpointIcon: {
      src: string
      color: string
    }
  }
  
  // Product card badge
  'product-card-badge'?: {
    type: string
    color: string
    backgroundColor: string
    show: boolean
  }
  
  // Title bar
  'title-bar'?: {
    type: string
    color: string
    backgroundColor: string
    show: boolean
  }
  
  // Logos (for TrustedBy)
  logos?: Array<{
    src: string
    alt: string
  }>
  
  // Background color for section wrapper
  backgroundColor?: string
  
  // Extracted icon colors (from nested structures)
  iconColors: Record<string, string>
  
  // Raw components array (for any other data not covered above)
  rawComponents: any[]
}

/**
 * Extracts text content from a component object
 */
function extractTextContent(component: any): Partial<ExtractedSectionData> {
  const extracted: Partial<ExtractedSectionData> = {}
  
  if (component.heading) {
    extracted.heading = {
      text: component.heading.text || '',
      color: component.heading.color || 'bodyColor',
      show: component.heading.show !== false,
    }
  }
  
  if (component.subheading) {
    extracted.subheading = {
      text: component.subheading.text || '',
      color: component.subheading.color || 'bodyColor',
      show: component.subheading.show !== false,
    }
  }
  
  if (component.paragraph) {
    extracted.paragraph = {
      text: component.paragraph.text || '',
      color: component.paragraph.color || 'bodyColor',
      show: component.paragraph.show !== false,
    }
  }
  
  return extracted
}

/**
 * Extracts button data from a component object
 */
function extractButtons(component: any): Partial<ExtractedSectionData> {
  const extracted: Partial<ExtractedSectionData> = {}
  
  if (component.ctaButton) {
    extracted.ctaButton = {
      text: component.ctaButton.text || '',
      color: component.ctaButton.color || 'accentColor1',
      backgroundColor: component.ctaButton.backgroundColor,
      show: component.ctaButton.show !== false,
    }
  }
  
  if (component.button) {
    extracted.button = {
      text: component.button.text || '',
      color: component.button.color || 'accentColor1',
      backgroundColor: component.button.backgroundColor,
      show: component.button.show !== false,
    }
  }
  
  // Preferred: buttons array (dynamic, scalable)
  if (Array.isArray(component.buttons)) {
    extracted.buttons = component.buttons.map((btn: any) => ({
      text: btn.text || '',
      color: btn.color || 'accentColor1',
      backgroundColor: btn.backgroundColor,
      show: btn.show !== false,
    }))
  }
  
  // Legacy: button1/button2 (for backwards compatibility)
  if (component.button1) {
    extracted.button1 = {
      text: component.button1.text || '',
      color: component.button1.color || 'accentColor1',
      backgroundColor: component.button1.backgroundColor,
      show: component.button1.show !== false,
    }
  }
  
  if (component.button2) {
    extracted.button2 = {
      text: component.button2.text || '',
      color: component.button2.color || 'accentColor1',
      backgroundColor: component.button2.backgroundColor,
      show: component.button2.show !== false,
    }
  }
  
  return extracted
}

/**
 * Extracts media assets from a component object
 */
function extractMedia(component: any): Partial<ExtractedSectionData> {
  const extracted: Partial<ExtractedSectionData> = {}
  
  if (component.media) {
    extracted.media = { ...component.media }
  }
  
  if (component.logo) {
    extracted.logo = {
      src: component.logo.src || '',
      alt: component.logo.alt || '',
      type: component.logo.type,
      sizes: component.logo.sizes,
      show: component.logo.show !== false,
    }
  }
  
  return extracted
}

/**
 * Extracts component-specific configurations
 */
function extractConfigs(component: any): Partial<ExtractedSectionData> {
  const extracted: Partial<ExtractedSectionData> = {}
  
  if (typeof component.marqueeSpeed === 'number') {
    extracted.marqueeSpeed = component.marqueeSpeed
  }
  
  if (component.productCard) {
    extracted.productCard = { ...component.productCard }
  }
  
  if (component.bulletPoints) {
    extracted.bulletPoints = { ...component.bulletPoints }
  }
  
  if (Array.isArray(component.steps)) {
    extracted.steps = component.steps.map((step: any) => ({
      title: step.title || '',
      subtext: step.subtext || '',
      icon: {
        src: step.icon?.src || '',
        alt: step.icon?.alt || '',
        type: step.icon?.type || 'svg-image',
        color: step.icon?.color || 'accentColor1',
      },
      order: step.order || 0,
    }))
  }
  
  if (Array.isArray(component['before-after'])) {
    extracted.beforeAfter = component['before-after']
  }
  
  if (Array.isArray(component.faq)) {
    extracted.faq = component.faq
  }
  
  if (component.stats) {
    extracted.stats = component.stats
  }
  
  if (component.infoCard) {
    extracted.infoCard = component.infoCard
  }
  
  if (component['infoCard with bulletpoint']) {
    extracted['infoCard with bulletpoint'] = component['infoCard with bulletpoint']
  }
  
  if (component['product-card-badge']) {
    extracted['product-card-badge'] = component['product-card-badge']
  }
  
  if (component['title-bar']) {
    extracted['title-bar'] = component['title-bar']
  }
  
  if (Array.isArray(component.logos)) {
    extracted.logos = component.logos
  }
  
  return extracted
}

/**
 * Extracts background color from components
 * NOTE: Button backgroundColor values are for buttons, not sections.
 * Only extract section-level background colors if they exist.
 * For now, we don't extract from buttons - sections default to backgroundColor.
 */
function extractBackgroundColor(components: any[]): string | undefined {
  // Look for section-level background color (not from buttons)
  // Currently, sections.json doesn't have section-level backgroundColor,
  // so we return undefined to use the default (backgroundColor)
  
  // If in the future sections.json has a section-level backgroundColor field,
  // extract it here
  
  // Don't extract from button configs - those are for buttons only
  return undefined
}

/**
 * Extracts and normalizes ALL data from sections.json structure
 * @param sectionData - Raw section data from sections.json
 * @returns Normalized section data ready for component consumption
 */
export function extractSectionData(
  sectionData: SectionData | null
): ExtractedSectionData | null {
  if (!sectionData) {
    if (isDev) {
      console.warn('[sectionDataExtractor] Section data is null')
    }
    return null
  }

  if (!sectionData.components || !Array.isArray(sectionData.components)) {
    if (isDev) {
      console.warn(
        `[sectionDataExtractor] Section "${sectionData.name}" has no components array`
      )
    }
    return null
  }

  // Merge all components into one extracted object
  const extracted: ExtractedSectionData = {
    iconColors: {},
    rawComponents: [],
  }

  // Process each component in the array
  for (const component of sectionData.components) {
    if (!component || typeof component !== 'object') {
      continue
    }

    // Extract text content
    Object.assign(extracted, extractTextContent(component))

    // Extract buttons
    Object.assign(extracted, extractButtons(component))

    // Extract media
    Object.assign(extracted, extractMedia(component))

    // Extract configs
    Object.assign(extracted, extractConfigs(component))

    // Store raw component for any other data
    extracted.rawComponents.push(component)
  }

  // Extract icon colors from the entire section data
  extracted.iconColors = extractIconColors(sectionData)

  // Extract background color
  const backgroundColor = extractBackgroundColor(sectionData.components)
  if (backgroundColor) {
    extracted.backgroundColor = backgroundColor
  }

  return extracted
}


