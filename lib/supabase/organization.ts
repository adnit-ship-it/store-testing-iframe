import { createClient } from '@/lib/supabase/client'
import type { Organization, BrandColors, WebsiteText } from '@/lib/types/database'

export interface OrganizationBranding {
    id: string
    name: string
    siteText: WebsiteText
    logoUrl: string
    altLogoUrl: string
    brandColors: BrandColors
}

export async function getOrganizationBranding(id: string): Promise<OrganizationBranding | null> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('organizations')
            .select(`
        id,
        name,
        website_text,
        logo_url,
        logo_alt_url,
        brand_colors
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching organization branding:', error)
            return null
        }

        if (!data) {
            console.warn(`No organization found with id: ${id}`)
            return null
        }

        return {
            id: data.id,
            name: data.name,
            siteText: data.website_text as WebsiteText,
            logoUrl: data.logo_url,
            altLogoUrl: data.logo_alt_url,
            brandColors: data.brand_colors as BrandColors
        }
    } catch (error) {
        console.error('Unexpected error fetching organization branding:', error)
        return null
    }
}