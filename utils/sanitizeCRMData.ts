import DOMPurify from 'dompurify'

export interface SanitizedCRMData {
  primaryMedicationTitleText?: string
  primaryMedicationSubtitleText?: string
  [key: string]: any
}

// Server-side sanitization without DOMPurify
function stripHtmlServer(rawData: any): SanitizedCRMData {
  const removeHtmlTags = (str: string) => str.replace(/<[^>]*>/g, '').trim()
  
  const sanitized: SanitizedCRMData = {}
  const htmlFields = ['primaryMedicationTitleText', 'primaryMedicationSubtitleText', 'heroHeading', 'heroSubheading']
  const productFields = ['name', 'description', 'soldOutListText', 'soldOutModalText']

  for (const [key, value] of Object.entries(rawData)) {
    if (htmlFields.includes(key) && typeof value === 'string') {
      sanitized[key] = removeHtmlTags(value)
    } else if (key === 'productBundles' && Array.isArray(value)) {
      sanitized[key] = value.map((bundle: any) => ({
        ...bundle,
        ...Object.fromEntries(productFields.map(field => [field, removeHtmlTags(bundle[field])]))
      }))
    } else if (key === 'defaultProductBundle' && value && typeof value === 'object') {
      sanitized[key] = {
        ...value,
        ...Object.fromEntries(productFields.map(field => [field, removeHtmlTags(value[field])]))
      }
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export function sanitizeCRMData(rawData: any): SanitizedCRMData {
  if (!rawData || typeof rawData !== 'object') {
    return {}
  }
  
  // Server-side: just strip HTML tags with regex
  if (!process.client) {
    return stripHtmlServer(rawData)
  }

  // Client-side: use DOMPurify
  const sanitized: SanitizedCRMData = {}
  const htmlFields = ['primaryMedicationTitleText', 'primaryMedicationSubtitleText', 'heroHeading', 'heroSubheading']
  const productFields = ['name', 'description', 'soldOutListText', 'soldOutModalText']

  for (const [key, value] of Object.entries(rawData)) {
    if (htmlFields.includes(key) && typeof value === 'string') {
      sanitized[key] = DOMPurify 
        ? DOMPurify.sanitize(value, { ALLOWED_TAGS: ['span', 'br', 'strong', 'em'], ALLOWED_ATTR: ['style', 'class'] })
        : value.replace(/<[^>]*>/g, '').trim()
    } else if (key === 'productBundles' && Array.isArray(value)) {
      sanitized[key] = value.map((bundle: any) => {
        const sanitizedBundle = { ...bundle }
        productFields.forEach(field => {
          if (bundle[field] && typeof bundle[field] === 'string') {
            if (DOMPurify) {
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = DOMPurify.sanitize(bundle[field], { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
              sanitizedBundle[field] = tempDiv.textContent || tempDiv.innerText || ''
            } else {
              sanitizedBundle[field] = bundle[field].replace(/<[^>]*>/g, '').trim()
            }
          }
        })
        return sanitizedBundle
      })
    } else if (key === 'defaultProductBundle' && value && typeof value === 'object') {
      const sanitizedBundle = { ...value }
      productFields.forEach(field => {
        if (value[field] && typeof value[field] === 'string') {
          if (DOMPurify) {
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = DOMPurify.sanitize(value[field], { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
            sanitizedBundle[field] = tempDiv.textContent || tempDiv.innerText || ''
          } else {
            sanitizedBundle[field] = value[field].replace(/<[^>]*>/g, '').trim()
          }
        }
      })
      sanitized[key] = sanitizedBundle
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
