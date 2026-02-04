// https://nuxt.com/docs/api/configuration/nuxt-config

// Load environment variables explicitly
import { config } from "dotenv";
config({ path: ".env" });

// Environment-specific configuration
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  //  "@supabase/ssr": "^0.7.0",
    // "@supabase/supabase-js": "^2.57.3",
  
    devServer: {
      port: 3005, // Change this to any available port you prefer
    },

  // HMR configuration to prevent navigation issues
  vite: {
    server: {
      hmr: {
        overlay: false // Disable error overlay during HMR
      }
    }
  },
  
  runtimeConfig: {
    // Server-only environment variables (not exposed to client)
    careValidateApiKey: isDevelopment ? process.env.NUXT_CAREVALIDATE_API_KEY_STAGING : process.env.NUXT_CAREVALIDATE_API_KEY_PROD,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    public: {
      // Environment detection
      isDevelopment,
      isProduction,

      // Form configuration
      formTitle: "Serenova Intake Form",
      formDescription: "Serenova - Patient Intake Form for GLP-1 Program",

      // Client-side API configuration (safe to expose)
      stripePublishableKey: isDevelopment ? process.env.NUXT_STRIPE_PUBLISHABLE_KEY_STAGING : process.env.NUXT_STRIPE_PUBLISHABLE_KEY_PROD,

      // Environment-specific API endpoints
      careValidateApiUrl: isDevelopment ? process.env.CARE_VALIDATE_API_URL_STAGING : process.env.CARE_VALIDATE_API_URL_PROD,

      // Supabase configuration (safe to expose)
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      
      // CMS configuration
      cmsOrganizationId: process.env.CMS_ORGANIZATION_ID,
      organizationLinkName: process.env.ORGANIZATION_LINK_NAME,
      
      // GraphQL URL for CRM data
      crmGraphqlUrl: isDevelopment 
        ? 'https://api-staging.care360-next.carevalidate.com/graphql/' 
        : 'https://api.care360-next.carevalidate.com/graphql/',
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/eslint-config", "nuxt-marquee", '@vueuse/motion/nuxt', '@pinia/nuxt'],
  plugins: [{ src: "~/plugins/toast.client.ts", mode: "client" }],
  
  nitro: {
    rollupConfig: {
      external: ['jsdom', 'isomorphic-dompurify']
    }
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
