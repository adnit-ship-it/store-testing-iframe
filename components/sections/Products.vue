<template>
  <UiSectionWrapper class="flex-col py-20">
    <!-- Heading -->
    <UiSectionContainer>
      <h2 v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
      }" 
        v-if="showTitle && heading?.show !== false"
        :class="[
          'pb-[24px] text-[20px] md:text-[28px] lg:text-[32px] font-semibold md:text-left',
          headingColorClass
        ]"
      >
        {{ heading?.text || 'Discover Our Products' }}
      </h2>
    </UiSectionContainer>

    <UiCardCarousel 
      :items="products" 
      :badge-config="badgeConfig"
      :title-bar-config="titleBarConfig"
      @item-click="openModal" 
    />

    <!-- Product Modal -->
    <UiProductModal :is-open="isModalOpen" :product="selectedProduct" @close="closeModal" />
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCRMStore } from "~/stores/crmStore";
import { resolveColorToken } from "~/utils/colorTokens";
import { products as staticProductCatalog } from "~/data/intake-form/products";

const crmStore = useCRMStore();

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  filteredProducts: {
    type: Array,
    default: null,
  },
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const badgeConfig = computed(() => props.sectionData?.['product-card-badge'])
const titleBarConfig = computed(() => props.sectionData?.['title-bar'])

// Modal state
const isModalOpen = ref(false);
const selectedProduct = ref(null);

// Note: Products component keeps API data (filteredProducts) separate from styling data (sectionData)
// The filteredProducts prop comes from parent (products.vue) and contains API product data

const fallbackProducts = computed(() =>
  ([]).map((product) => {
    const staticMatch = staticProductCatalog.find(
      (staticProduct) => staticProduct.id === product.id,
    );

    const productBundleIds = staticMatch?.productBundleIds || {
      monthly: product.id,
    };

    const modalProduct = {
      id: staticMatch?.id || product.id,
      imageUrl: product.image?.src || staticMatch?.img || "",
      productName: product.productName,
      price: product.price,
      productBundleIds,
      quizId: staticMatch?.quizId,
    };

    return {
      id: product.id,
      imageSrc: product.image?.src || staticMatch?.img || "",
      imageAlt: product.image?.alt || product.productName,
      productName: product.productName,
      price: product.price,
      isBestSeller: product.isBestSeller,
      modalProduct,
    };
  })
);

// Helper function to transform API bundle to display format
function transformApiBundle(bundle: any, index: number, fallbackItems: any[]) {
  const fallback =
    fallbackItems.length > 0
      ? fallbackItems[index % fallbackItems.length]
      : {};

  const monthlyBundleId = bundle.productBundleIds?.monthly || bundle.linkName || bundle.id;

  const derivedQuizId =
    bundle.quizId ||
    bundle.formVersion?.forms?.[0]?.slug ||
    bundle.formVersion?.forms?.[0]?.id;

  const modalProduct = {
    id: bundle.id,
    imageUrl: bundle.imageUrl || fallback?.imageSrc || "",
    productName: bundle.name || `Product ${index + 1}`,
    price: bundle.price ? `$${bundle.price}` : fallback?.price || "$0",
    productBundleIds: {
      monthly: monthlyBundleId,
    },
    quizId: derivedQuizId,
  };

  return {
    id: bundle.id,
    imageSrc: bundle.imageUrl || fallback?.imageSrc || "",
    imageAlt: bundle.name || `Product ${index + 1}`,
    productName: bundle.name || `Product ${index + 1}`,
    price: bundle.price ? `$${bundle.price}` : "$0",
    isBestSeller:
      bundle.tag === "BEST_SELLER" ||
      bundle.tag === "bestseller" ||
      index === 1,
    modalProduct,
  };
}

// Helper function to transform static product to display format
function transformStaticProduct(product: any) {
  const modalProduct = {
    id: product.id,
    imageUrl: product.img,
    productName: product.name,
    price: `$${product.prices.monthly}`,
    productBundleIds: product.productBundleIds || {
      monthly: product.id,
    },
    quizId: product.quizId,
  };

  return {
    id: product.id,
    imageSrc: product.img,
    imageAlt: product.name,
    productName: product.name,
    price: `$${product.prices.monthly}`,
    isBestSeller: product.popular || false,
    modalProduct,
  };
}

// Product list - computed to use filtered products, API data, or fallback
const products = computed(() => {
  // If filtered products are provided from parent (products page), use them
  if (props.filteredProducts && props.filteredProducts.length > 0) {
    const fallbackItems = fallbackProducts.value;
    
    // Check if filtered products are API bundles or static products
    const firstItem = props.filteredProducts[0];
    
    // If it's a static product (has img, prices, etc.) - check this FIRST
    if (firstItem && (firstItem.img || firstItem.prices)) {
      return props.filteredProducts.map((product: any) => 
        transformStaticProduct(product)
      );
    }
    
    // If it's an API bundle (has imageUrl, name, etc.)
    if (firstItem && (firstItem.imageUrl || firstItem.name)) {
      return props.filteredProducts.map((bundle: any, index: number) => 
        transformApiBundle(bundle, index, fallbackItems)
      );
    }
  }
  
  // Original logic: use API data or fallback
  const apiProducts = crmStore.getProductBundles;
  const fallbackItems = fallbackProducts.value;

  // If we have API data, transform it to match the expected format
  if (apiProducts && apiProducts.length > 0) {
    return apiProducts.map((bundle: any, index: number) => 
      transformApiBundle(bundle, index, fallbackItems)
    );
  }

  // Fallback to hardcoded products if no API data
  if (fallbackItems.length > 0) {
    return fallbackItems;
  }

  // Final fallback: use static products directly
  return staticProductCatalog.map((product: any) => 
    transformStaticProduct(product)
  );
});

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-black'
  return resolveColorToken(heading.value.color, 'text')
})

// Open modal with product data
const openModal = (product) => {
  selectedProduct.value = product.modalProduct || null;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
