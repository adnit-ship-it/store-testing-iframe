<template>
  <UiSectionWrapper class="py-24 md:py-32 flex-col bg-backgroundColor">
    <!-- Render all sections in order from pages.json -->
    <template v-for="section in pageSections" :key="section.name">
      <!-- Products Hero: Render inline content when component is null -->
      <UiSectionContainer v-if="section.name === 'Products Hero' && section.component === null" class="mb-20">
        <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
          },
        }" src="/assets/images/brand/logo-secondary-1.svg" alt="brand logo" class="object-cover" :style="{ height: productsLogoHeight, width: productsLogoWidth }" />
        <h1 v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 25,
          },
        }" class="text-[32px] md:text-[48px] font-semibold mt-2 md:mt-4 lg:mt-8">
          {{ page?.title || 'Explore Our Products' }}
        </h1>
        <p v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 50,
          },
        }" class="text-[16px] md:text-[23px] font-extralight mt-2">
          {{ page?.subtitle || 'Personalized GLP-1 Medication' }}
        </p>
        <div class="h-4 md:h-8"></div>
        <div class="flex gap-4 flex-wrap">
          <!-- Always show "All" button -->
          <UiButton 
            @click="selectedCategory = 'all'"
            :ghost="selectedCategory !== 'all'"
            v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 75,
              },
            }" :width="buttonWidth" :height="buttonHeight" :font-size="buttonFontSize" background-color="accentColor2">
            All
          </UiButton>
          
          <!-- Dynamically render category buttons only for categories that have products -->
          <UiButton 
            v-for="category in availableCategories"
            :key="category"
            @click="selectedCategory = category"
            :ghost="selectedCategory !== category"
            v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 75,
              },
            }" :width="buttonWidth" :height="buttonHeight" :font-size="buttonFontSize" background-color="accentColor2">
            {{ categoryLabels[category] }}
          </UiButton>
        </div>
      </UiSectionContainer>
      
      <!-- All other sections: Render via DynamicSection -->
      <DynamicSection 
        v-else
        :section="section"
        :additional-props="getAdditionalPropsForSection(section)"
      />
    </template>
  </UiSectionWrapper>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useCRMStore } from '~/stores/crmStore';
import { usePagesStore } from '~/stores/pagesStore';
import { useRoute } from 'vue-router';
import { products as staticProducts, categoryLabels } from '~/data/intake-form/products';
import type { ProductCategory } from '~/types/intake-form/checkout';
import { getLogoSize } from '~/utils/branding';

const crmStore = useCRMStore();
const pagesStore = usePagesStore();
const route = useRoute();

// Get products page config from pages.json
const getCurrentPageName = () => {
  const path = route.path;
  if (path.startsWith('/products')) return 'products';
  return 'home';
};

const pageConfig = computed(() => {
  const pageName = getCurrentPageName();
  return pagesStore.getPageConfig(pageName);
});

const page = computed(() => ({
  title: pageConfig.value?.pageTitle || 'Explore Our Products',
  subtitle: pageConfig.value?.subtitle || 'Personalized GLP-1 Medication',
  categoryButton: pageConfig.value?.categoryButton || 'Weight Loss'
}));

// Mobile detection
const isMobile = ref(false);
const isTablet = ref(false);

// Check mobile on mount and resize
const checkMobile = () => {
  const width = window.innerWidth;
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;
};

const productsLogoHeight = computed(() => getLogoSize('products', 'height', isMobile.value, isTablet.value));
const productsLogoWidth = computed(() => getLogoSize('products', 'width', isMobile.value, isTablet.value));

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Derived button sizes
const buttonWidth = computed(() => (isMobile.value ? "144px" : "320px"));
const buttonHeight = computed(() => (isMobile.value ? "20px" : "44px"));
const buttonFontSize = computed(() => (isMobile.value ? "12" : "24"));

// Category filter state - defaults to 'all'
const selectedCategory = ref<'all' | ProductCategory>('all' as 'all' | ProductCategory);

// Get all products (from API or static)
const allProducts = computed(() => {
  const apiProducts = crmStore.getProductBundles;
  
  // If we have API products, use them (they'll be filtered in Products.vue)
  if (apiProducts && apiProducts.length > 0) {
    return apiProducts;
  }
  
  // Otherwise use static products
  return staticProducts;
});

// Get available categories dynamically
const availableCategories = computed(() => {
  // Get categories from API products if available
  const apiProducts = crmStore.getProductBundles;
  if (apiProducts && apiProducts.length > 0) {
    const categories = new Set();
    apiProducts.forEach((bundle: any) => {
      if (bundle.products && Array.isArray(bundle.products)) {
        bundle.products.forEach((product: any) => {
          if (product.categories && Array.isArray(product.categories)) {
            product.categories.forEach((cat: any) => {
              // Map API category name to our ProductCategory type
              const categoryName = cat.name?.toLowerCase().replace(/\s+/g, '-');
              if (categoryName && isValidCategory(categoryName)) {
                categories.add(categoryName);
              }
            });
          }
        });
      }
    });
    return Array.from(categories) as ProductCategory[];
  }
  
  // Fallback to static products categories - inline logic to avoid SSR issues
  const categories = new Set<ProductCategory>();
  staticProducts.forEach((product) => {
    if (product.category) {
      categories.add(product.category as ProductCategory);
    }
  });
  return Array.from(categories);
});

// Helper to check if category is valid
function isValidCategory(cat: string): cat is ProductCategory {
  return ['weight-loss', 'sexual health', 'wellness', 'hair', 'skin'].includes(cat);
}

// Filter products based on selected category
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return allProducts.value; // Show all products
  }
  
  const apiProducts = crmStore.getProductBundles;
  
  // If using API products, filter by category
  if (apiProducts && apiProducts.length > 0) {
    return apiProducts.filter((bundle: any) => {
      if (!bundle.products || !Array.isArray(bundle.products)) return false;
      
      return bundle.products.some((product: any) => {
        if (!product.categories || !Array.isArray(product.categories)) return false;
        
        return product.categories.some((cat: any) => {
          const categoryName = cat.name?.toLowerCase().replace(/\s+/g, '-');
          return categoryName === selectedCategory.value;
        });
      });
    });
  }
  
  // Filter static products
  return staticProducts.filter(product => product.category === selectedCategory.value);
});

// Get current page key from route
const pageKey = computed(() => {
  if (route.path === '/') return 'home'
  return route.path.slice(1) // Remove leading '/'
})

// Get ordered sections for this page
const pageSections = computed(() => {
  return pagesStore.getPageSections(pageKey.value)
})

// Get additional props for specific sections (e.g., filteredProducts for SectionsProducts)
const getAdditionalPropsForSection = (section: any) => {
  if (section.component === 'SectionsProducts') {
    return {
      filteredProducts: filteredProducts.value
    }
  }
  return {}
}

definePageMeta({
  layout: "products",
});
</script>

<style scoped>
/* Products page styles */
</style>
