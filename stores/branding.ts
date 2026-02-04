import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BrandColors {
  accent1: string
  accent2: string
  background: string
  body: string
}

export interface BrandingData {
  id: string
  name: string
  logoUrl: string
  altLogoUrl: string
  brandColors: BrandColors
}

export const useBrandingStore = defineStore('branding', () => {
  const branding = ref<BrandingData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const setBranding = (data: BrandingData) => {
    branding.value = data
  }

  const getBrandColors = () => branding.value?.brandColors || null
  const getLogoUrl = () => branding.value?.logoUrl || null
  const getAltLogoUrl = () => branding.value?.altLogoUrl || null
  const getOrganizationName = () => branding.value?.name || null

  return {
    branding,
    isLoading,
    error,
    setBranding,
    getBrandColors,
    getLogoUrl,
    getAltLogoUrl,
    getOrganizationName
  }
})