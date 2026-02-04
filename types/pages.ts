export interface PageSectionReference {
  name: string
  component: string | null
  props: Record<string, any>
  show: boolean
  order: number
}

export interface PageConfig {
  title: string
  show: boolean
  order: number
  description: string
  sections: PageSectionReference[]
  // Optional page-specific properties
  pageTitle?: string
  subtitle?: string
  categoryButton?: string
  logo?: {
    src: string
    alt: string
  }
  form?: any
  navbar?: any
  footer?: any
}

export interface LogoSizeConfig {
  height: {
    mobile: string
    tablet?: string
    desktop: string
  }
  width: {
    mobile: string
    tablet?: string
    desktop: string
  }
}

export interface LoadingScreenConfig {
  logo: {
    src: string
    alt: string
  }
  text: string
}

export interface CommonConfig {
  pageTitle: string
  buttons: {
    next: string
    submitToProvider: string
    back: string
    getStarted: string
  }
  navigation: {
    home: string
    about: string
    products: string
    contact: string
    contactUs: string
    product: string
  }
  accessibility: {
    toggleMenu: string
    brandLogo: string
    menu: string
  }
  media: {
    hamburgerMenu: {
      src: string
      alt: string
    }
  }
}

export interface PagesData {
  iconRegistry?: any
  logoRegistry?: any
  logoSizes?: {
    navbar?: LogoSizeConfig
    footer?: LogoSizeConfig
    loadingScreen?: Omit<LogoSizeConfig, 'height'> & { height: { mobile: string; desktop: string } }
    hero?: LogoSizeConfig
    contact?: LogoSizeConfig
    products?: LogoSizeConfig
  }
  loadingScreen?: LoadingScreenConfig
  common?: CommonConfig
  [key: string]: PageConfig | any
}
