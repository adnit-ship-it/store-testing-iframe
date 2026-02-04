import { defineStore } from 'pinia'
import { sanitizeCRMData } from '~/utils/sanitizeCRMData.client'

// Load DOMPurify only on client
let DOMPurify: any = null
if (process.client) {
  import('dompurify').then(module => {
    DOMPurify = module.default
  })
}

export const useCRMStore = defineStore('crm', {
  state: () => ({
    rawHtmlData: '',
    sanitizedData: {} as Record<string, any>,
    productBundles: [] as any[],
    defaultProductBundle: null as any,
    isLoading: false,
    error: null as string | null,
    heroHeading: '',
    heroSubheading: ''
  }),

  getters: {
    // These getters now just return the state values
    getHeroHeading: (state) => {
      return state.heroHeading || 'Lose weight with GLP-1 medications.'
    },
    getHeroSubheading: (state) => {
      return state.heroSubheading || 'Start your journey with us today!'
    },
    
    // Product getters
    getProductBundles: (state) => {
      return state.productBundles || []
    },
    getDefaultProductBundle: (state) => {
      return state.defaultProductBundle
    }
  },

  actions: {
    // Store raw HTML data from API
    setRawHtmlData(htmlString: string) {
      this.rawHtmlData = htmlString
    },

    // Set sanitized data
    setSanitizedData(data: Record<string, any>) {
      // First sanitize the entire data object
      const sanitizedData = sanitizeCRMData(data)
      this.sanitizedData = sanitizedData
      this.updateHeroFromSanitizedData()
      this.updateProductData(sanitizedData)
    },

    // Update product data from sanitized data
    updateProductData(data: Record<string, any>) {
      if (data?.productBundles) {
        // Sanitize product bundle data
        this.productBundles = data.productBundles.map((bundle: any) => ({
          ...bundle,
          name: this.sanitizeText(bundle.name),
          description: this.sanitizeText(bundle.description),
          soldOutListText: this.sanitizeText(bundle.soldOutListText),
          soldOutModalText: this.sanitizeText(bundle.soldOutModalText)
        }))
      }
      
      if (data?.defaultProductBundle) {
        // Sanitize default product bundle data
        this.defaultProductBundle = {
          ...data.defaultProductBundle,
          name: this.sanitizeText(data.defaultProductBundle.name),
          description: this.sanitizeText(data.defaultProductBundle.description),
          soldOutListText: this.sanitizeText(data.defaultProductBundle.soldOutListText),
          soldOutModalText: this.sanitizeText(data.defaultProductBundle.soldOutModalText)
        }
      }
    },

    // Set hero content directly
    setHeroContent(heading: string, subheading: string) {
      this.heroHeading = heading
      this.heroSubheading = subheading
    },

    // Update hero content from sanitized data
    updateHeroFromSanitizedData() {
      try {
        const titleText = this.sanitizedData.primaryMedicationTitleText || ''
        
        if (process.client) {
          // Client-side: Use DOMPurify and DOM methods
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = titleText
          
          const spans = tempDiv.querySelectorAll('span')
          
          if (spans.length > 0) {
            this.heroHeading = spans[0]?.textContent?.trim() || 'Lose weight with GLP-1 medications.'
            
            if (spans.length > 1) {
              this.heroSubheading = spans[1]?.textContent?.trim() || 'Start your journey with us today!'
            }
          }
        } else {
          // Server-side: Use regex parsing for text extraction
          const headingMatch = titleText.match(/<span[^>]*>([^<]+)<\/span>/)
          if (headingMatch && headingMatch[1]) {
            this.heroHeading = headingMatch[1].trim()
          }
          
          // Look for content after <br> tag for subheading
          const subheadingMatch = titleText.match(/<br[^>]*>\s*<span[^>]*>([^<]+)<\/span>/)
          if (subheadingMatch && subheadingMatch[1]) {
            this.heroSubheading = subheadingMatch[1].trim()
          }
        }
        
      } catch (error) {
        console.error('❌ Error parsing hero content:', error)
        // Keep fallback values if parsing fails
        this.heroHeading = 'Lose weight with GLP-1 medications.'
        this.heroSubheading = 'Start your journey with us today!'
      }
    },

    // Parse HTML and update hero content using DOMPurify
    updateHeroFromHtml(htmlString: string) {
      
      this.rawHtmlData = htmlString
      
      try {
        let newHeading = 'Lose weight with GLP-1 medications.'
        let newSubheading = 'Start your journey with us today!'
        
        if (process.client && DOMPurify) {
          // Client-side: Use DOMPurify and DOM methods
          const cleanHtml = DOMPurify.sanitize(htmlString, { 
            ALLOWED_TAGS: ['span', 'br'],
            ALLOWED_ATTR: ['style', 'data-metadata', 'data-buffer']
          })
          
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = cleanHtml
          
          const spans = tempDiv.querySelectorAll('span')
          
          if (spans.length > 0) {
            newHeading = spans[0]?.textContent?.trim() || 'Lose weight with GLP-1 medications.'
            
            if (spans.length > 1) {
              newSubheading = spans[1]?.textContent?.trim() || 'Start your journey with us today!'
            }
          }
        } else {
          // Server-side: Use regex parsing for text extraction
          const headingMatch = htmlString.match(/<span[^>]*>([^<]+)<\/span>/)
          if (headingMatch && headingMatch[1]) {
            newHeading = headingMatch[1].trim()
          }
          
          // Look for content after <br> tag for subheading
          const subheadingMatch = htmlString.match(/<br[^>]*>\s*<span[^>]*>([^<]+)<\/span>/)
          if (subheadingMatch && subheadingMatch[1]) {
            newSubheading = subheadingMatch[1].trim()
          }
        }
        
        this.heroHeading = newHeading
        this.heroSubheading = newSubheading
        
      } catch (error) {
        console.error('❌ Error parsing hero content:', error)
        // Keep fallback values if parsing fails
        this.heroHeading = 'Lose weight with GLP-1 medications.'
        this.heroSubheading = 'Start your journey with us today!'
      }
    },

    // Sanitize text content to remove HTML tags and metadata
    sanitizeText(text: string | undefined | null): string {
      if (!text || typeof text !== 'string') {
        return ''
      }
      
      try {
        // Server-side or if DOMPurify not loaded: use regex
        if (!process.client || !DOMPurify) {
          return text.replace(/<[^>]*>/g, '').trim()
        }
        
        // Client-side with DOMPurify: sanitize HTML
        const sanitized = DOMPurify.sanitize(text, {
          ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
          ALLOWED_ATTR: ['style', 'class']
        })
        
        // Extract text content
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = sanitized
        return tempDiv.textContent || tempDiv.innerText || ''
      } catch (error) {
        console.warn('Error sanitizing text:', error)
        // Fallback to regex
        return text.replace(/<[^>]*>/g, '').trim()
      }
    },

    // Fetch CRM data
    async fetchCRMData() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await $fetch('/api/crm-data')
        
        // Update hero content
        if (response?.primaryMedicationTitleText) {
          this.updateHeroFromHtml(response.primaryMedicationTitleText)
        }
        
        // Store all sanitized data (this will also update product data)
        this.setSanitizedData(response || {})
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('Error fetching CRM data:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}) 