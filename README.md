# Serenova Site

A comprehensive Nuxt.js application for Serenova's weight loss platform, featuring an interactive intake form, product showcase, and patient journey visualization.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
Serenova-site/
├── app.vue                          # Main app component with CRM data fetching
├── nuxt.config.ts                   # Nuxt configuration and environment setup
├── tailwind.config.js               # Tailwind CSS configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.js                 # ESLint configuration
│
├── assets/                          # Static assets
│   ├── css/
│   │   └── main.css                 # Global CSS styles
│   └── fonts/                       # Custom font files
│       ├── AllRoundGothicBold.woff2
│       ├── AllRoundGothicSemi.woff2
│       ├── DMSerifText-Regular.woff2
│       └── Quicksand-VariableFont_wght.woff2
│
├── components/                      # Vue components
│   ├── DynamicSection.vue           # Dynamic section renderer
│   ├── GlobalLoadingScreen.vue      # Global loading screen component
│   ├── examples/                    # Example components
│   │   └── BrandingExample.vue      # Branding example component
│   ├── intake-form/                 # Intake form components
│   │   ├── checkout/                # Checkout flow components
│   │   │   ├── Navigation.vue
│   │   │   ├── PaymentStep.vue
│   │   │   └── ProductSelection.vue
│   │   ├── inputs/                  # Form input components
│   │   │   ├── BeforeAfter.vue
│   │   │   ├── Checkbox.vue
│   │   │   ├── Dropdown.vue
│   │   │   ├── FileInput.vue
│   │   │   ├── Marketing.vue
│   │   │   ├── MedicalReview.vue
│   │   │   ├── Perfect.vue
│   │   │   ├── Select.vue
│   │   │   ├── StripePayment.vue
│   │   │   ├── Textarea.vue
│   │   │   ├── TextInput.vue
│   │   │   ├── WeightSummary.vue
│   │   │   └── YesNoButtons.vue
│   │   ├── FormStepLayout.vue
│   │   ├── Header.vue
│   │   ├── Navigation.vue
│   │   ├── ProgressTracker.vue
│   │   ├── QuestionRenderer.vue
│   │   └── WeightSummaryDisplay.vue
│   ├── layout/                      # Layout components
│   │   ├── Footer.vue
│   │   └── Navbar.vue
│   ├── sections/                    # Page section components
│   │   ├── AboutBanner.vue
│   │   ├── AboutPriority.vue
│   │   ├── BeforeAfter.vue
│   │   ├── CTA.vue
│   │   ├── Discover.vue
│   │   ├── FAQ.vue
│   │   ├── Hero.vue
│   │   ├── IntakeForm.vue
│   │   ├── Journey.vue              # Patient journey with scroll animations
│   │   ├── Products.vue
│   │   ├── Reviews.vue
│   │   ├── Statistics.vue
│   │   └── TrustedBy.vue
│   └── ui/                          # Reusable UI components
│       ├── Button.vue
│       ├── CardCarousel.vue
│       ├── Icon.vue
│       ├── JourneyCard.vue
│       ├── ProductCard.vue
│       ├── ProductModal.vue
│       ├── SectionContainer.vue
│       ├── SectionWrapper.vue
│       └── TestimonialCarousel.vue
│
├── composables/                      # Vue composables
│   └── intake-form/
│       ├── useCheckout.ts           # Checkout state management
│       ├── useFormPersistence.ts   # Form data persistence
│       ├── useFormState.ts         # Form state management
│       ├── usePatientForm.ts       # Patient form logic
│       └── useStripe.ts            # Stripe integration
│
├── data/                            # Static data and configurations
│   ├── designTokens.json           # Design tokens (colors, fonts, etc.)
│   ├── pages.json                  # Page configuration data
│   ├── sections.json               # Section configuration data
│   ├── intake-form/
│   │   ├── formSteps.ts            # Form step definitions
│   │   ├── products.ts             # Product catalog utilities
│   │   ├── productsList.json       # Product list data (JSON)
│   │   └── quizConfigs.ts          # Quiz configurations
│   └── reviews.ts                  # Customer reviews data
│
├── layouts/                         # Page layouts
│   ├── default.vue                 # Default layout
│   └── products.vue                # Products page layout
│
├── lib/                             # Library code and utilities
│   ├── config/
│   │   └── quiz.ts                 # Quiz configuration
│   ├── quiz/                       # Quiz logic
│   │   ├── conditionEvaluator.ts   # Condition evaluation logic
│   │   └── conditionExamples.ts    # Condition examples
│   ├── supabase/                   # Supabase integration
│   │   ├── client.ts               # Supabase client setup
│   │   ├── organization.ts         # Organization data handling
│   │   └── quizzes.ts             # Quiz data handling
│   └── types/
│       └── database.ts             # Database type definitions
│
├── pages/                           # Application pages
│   ├── about.vue                   # About page
│   ├── checkout.vue                # Checkout page
│   ├── consultation.vue           # Consultation page
│   ├── contact.vue                 # Contact page
│   ├── index.vue                   # Homepage
│   ├── products.vue                # Products page
│   └── welcome.vue                 # Welcome page
│
├── plugins/                         # Nuxt plugins
│   ├── pages.ts                    # Pages plugin
│   └── toast.client.ts             # Toast notifications (client-only)
│
├── public/                          # Public static assets
│   ├── assets/
│   │   └── images/                 # Images and icons
│   │       ├── before-after/       # Before/after images
│   │       ├── clients/            # Client logos
│   │       ├── intake-form/        # Form-specific images
│   │       │   ├── before-after/
│   │       │   ├── icons/
│   │       │   ├── marketing/
│   │       │   └── option-icons/
│   │       └── products/           # Product images
│   ├── favicon.ico
│   └── robots.txt
│
├── server/                          # Server-side API endpoints
│   └── api/
│       ├── cleanup-files.post.ts   # File cleanup endpoint
│       ├── confirm-payment-setup.post.ts
│       ├── create-setup-intent.post.ts
│       ├── crm-data.get.ts         # CRM data fetching
│       ├── get-file.get.ts         # File retrieval endpoint
│       ├── submit-form.post.ts     # Form submission
│       └── upload-file.post.ts     # File upload endpoint
│
├── stores/                          # Pinia stores
│   ├── branding.ts                 # Branding state management
│   ├── crmStore.ts                 # CRM data store
│   └── pagesStore.ts               # Pages state management
│
├── types/                           # TypeScript type definitions
│   ├── index.ts                    # Global types
│   ├── pages.ts                    # Page types
│   └── intake-form/
│       ├── checkout.ts             # Checkout types
│       └── form.ts                 # Form types
│
└── utils/                           # Utility functions
    ├── branding.ts                 # Branding utilities
    ├── colorTokens.ts              # Color token utilities
    ├── dompurify.client.ts         # DOMPurify client-side
    ├── dompurify.ts                # DOMPurify server-side
    ├── sanitizeCRMData.client.ts   # CRM data sanitization (client)
    ├── sanitizeCRMData.ts          # CRM data sanitization (server)
    ├── sectionComponents.ts        # Section component mapping
    ├── sectionDataExtractor.ts     # Section data extraction
    └── intake-form/
        ├── buildFormPayload.ts     # Form payload builder
        ├── calculations.ts         # Form calculations
        ├── componentMapper.ts      # Component mapping
        ├── convertFile.ts          # File conversion utilities
        ├── submitForm.ts           # Form submission logic
        ├── textInterpolation.ts    # Text interpolation
        └── validation.ts           # Form validation
```

## ⚙️ Configuration

### Environment Variables

The application uses environment-specific configuration in `nuxt.config.ts`:

#### Server-side (Private)
- `careValidateApiKey`: API key for CareValidate integration (staging/prod)
- `supabaseServiceRoleKey`: Supabase service role key

#### Client-side (Public)
- `stripePublishableKey`: Stripe publishable key (staging/prod)
- `careValidateApiUrl`: CareValidate API endpoint (staging/prod)
- `formTitle`: Form title configuration
- `formDescription`: Form description
- `supabaseUrl`: Supabase project URL
- `supabaseAnonKey`: Supabase anonymous key
- `cmsOrganizationId`: CMS organization ID
- `organizationLinkName`: Organization link name
- `crmGraphqlUrl`: CRM GraphQL endpoint (staging/prod)

### Tailwind CSS Configuration

Custom theme configuration in `tailwind.config.js` uses design tokens from `data/designTokens.json`:

#### Colors
- `backgroundColor`: "#F5F3ED" (Light cream)
- `bodyColor`: "#4A4A4A" (Dark gray)
- `accentColor1`: "#750021" (Dark red) with 50% opacity variant
- `accentColor2`: "#A97585" (Muted rose)

**Note**: Colors can be dynamically overridden via branding API and CSS custom properties.

#### Fonts
- `headingFont`: Loaded from `designTokens.json` (default: AllRoundGothicSemi)
- `bodyFont`: Loaded from `designTokens.json` (default: Quicksand)
- `defaultSerif`: Loaded from `designTokens.json` (default: DMSerifText-Regular)

**Note**: Fonts are dynamically loaded from design tokens, allowing for brand customization.

### Nuxt Modules

- `@nuxtjs/tailwindcss`: Tailwind CSS integration
- `@nuxt/eslint-config`: ESLint configuration
- `nuxt-marquee`: Marquee text component
- `@vueuse/motion/nuxt`: Motion animations
- `@pinia/nuxt`: State management

### Key Dependencies

- `@supabase/supabase-js` & `@supabase/ssr`: Supabase integration for CMS and data management
- `@stripe/stripe-js` & `stripe`: Stripe payment processing
- `dompurify`: HTML sanitization for security
- `browser-image-compression`: Client-side image compression
- `pako`: Compression utilities
- `vue-toastification`: Toast notifications

## 🎨 Design System

### Typography
- **Headings**: AllRoundGothicSemi font family
- **Body Text**: Quicksand variable font
- **Serif Text**: DMSerifText-Regular for special text

### Color Palette
- **Primary Background**: Light cream (#F5F3ED)
- **Body Text**: Dark gray (#4A4A4A)
- **Primary Accent**: Dark red (#750021)
- **Secondary Accent**: Muted rose (#A97585)

**Note**: Colors are dynamically configurable via branding system and design tokens.

### Components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: VueUse Motion for scroll-triggered animations
- **Form Components**: Comprehensive input system with validation
- **UI Components**: Reusable button, card, and layout components

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Key Features

#### Intake Form System
- Multi-step form with progress tracking
- Dynamic question rendering
- File upload capabilities
- Form persistence across sessions
- Stripe payment integration
- CareValidate API integration

#### Patient Journey Visualization
- Interactive scroll-based animations
- Progress indicators for mobile/tablet
- Responsive design across all devices
- Motion animations for enhanced UX

#### Product Management
- Product catalog with images
- Product selection interface
- Pricing and discount handling
- Inventory management

#### CRM Integration
- Real-time CRM data fetching via GraphQL
- Patient case management
- Form submission to external APIs
- Error handling and validation
- Data sanitization for security

#### Branding System
- Dynamic branding via Supabase CMS
- Design token management
- Color and font customization
- Organization-specific theming

#### Supabase Integration
- CMS content management
- Organization data management
- Quiz configuration storage
- Dynamic page and section rendering

#### File Management
- File upload with compression
- Secure file storage
- File retrieval endpoints
- Automatic cleanup utilities

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Setup
1. Configure environment variables (see Configuration section)
2. Set up API keys for:
   - CareValidate (staging and production)
   - Stripe (staging and production)
   - Supabase (URL, anon key, service role key)
3. Configure CMS organization ID and link name
4. Set up design tokens in `data/designTokens.json`
5. Configure CDN for static assets
6. Set up monitoring and error tracking

## 📝 Notes

- **Hydration**: The application handles SSR/CSR hydration properly with client-only components where needed
- **Performance**: Optimized with lazy loading, image optimization, and efficient state management
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO**: Meta tags, structured data, and proper heading hierarchy
- **Security**: 
  - API keys properly secured (server-side vs client-side separation)
  - Form validation and sanitization
  - XSS protection via DOMPurify
  - CRM data sanitization utilities
- **Branding**: Dynamic branding system allows for multi-tenant customization via Supabase CMS
- **File Handling**: Secure file upload with compression and automatic cleanup
- **Development Server**: Runs on port 3005 by default (configurable in `nuxt.config.ts`)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow ESLint and Prettier configurations
4. Test on multiple devices and screen sizes
5. Ensure accessibility compliance
6. Update documentation for new features
