<template>
  <UiSectionWrapper 
    v-if="media?.background?.src"
    class="relative z-[2] lg:min-h-[90vh] bg-cover bg-no-repeat bg-center" 
    :style="{
      backgroundImage: `url('${media?.background?.src}')`
    }"
  >
    <!-- Background overlay for better text readability -->
    <div class="absolute inset-0 bg-black bg-opacity-30"></div>

    <UiSectionContainer class="relative z-10 h-full flex gap-8 lg:gap-0 flex-col-reverse lg:flex-row items-center justify-between py-20">
      <!-- Product Card - Left Side -->
      <div class="bg-white shadow-lg p-8 w-full max-w-md">
        <!-- Product Image -->
        <div class="mb-6">
          <img 
            :src="productImageUrl" 
            :alt="productName"
            class="w-[384px] h-[384px] object-contain bg-backgroundColor" 
          />
        </div>

        <!-- Product Details -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-bodyColor">{{ productName }}</h3>
            <span class="text-lg font-semibold text-bodyColor">${{ productPrice }}</span>
          </div>

          <p :class="['text-sm', bodyTextColorClass]">{{ productDescription }}</p>
          <p :class="['text-xs', bodyTextColorClass]">Free Shipping. Fast Delivery.</p>
          <div class="flex justify-between items-center mt-6">
            <p :class="['text-sm font-medium', bodyTextColorClass]">Speak to a provider today!</p>
            <!-- Buy Now Button -->
            <NuxtLink :to="`/consultation?productId=${product?.id || ''}`">
              <UiButton 
                :background-color="buttonBackgroundColor" 
                textColor="white" 
                width="full" 
                height="32px" 
                fontSize="16"
              >
                {{ productCard?.button?.text || 'Buy Now' }}
              </UiButton>
            </NuxtLink>
          </div>


        </div>
      </div>

      <!-- Text Content - Right Side -->
      <div class="text-white text-center max-w-3xl">
        <h2 v-if="heading?.show !== false" :class="[
          'text-[28px] md:text-[32px] lg:text-[48px] font-semibold mb-4',
          headingColorClass
        ]">
          {{ heading?.text || 'Discover Your Best Self' }}
        </h2>
        <h3 v-if="subheading?.show !== false" :class="[
          'text-[24px] md:text-[28px] lg:text-[40px]',
          subheadingColorClass
        ]">
          {{ subheading?.text || 'Lose Weight Today' }}
        </h3>
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveColorToken } from '~/utils/colorTokens'
import { getProductById } from '~/data/intake-form/products'
import type { Product } from '~/types/intake-form/checkout'

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const subheading = computed(() => props.sectionData?.subheading)
const media = computed(() => props.sectionData?.media)
const productCard = computed(() => props.sectionData?.productCard)

console.log('productCard', productCard.value)

// Get productId from productCard config
const productId = computed(() => productCard.value?.productId)

// Find the product from products.ts
const product = computed<Product | undefined>(() => {
  if (productId.value) {
    console.log('productId', productId, getProductById(productId.value))
    return getProductById(productId.value)
  }
  return undefined
})

// Compute product data from the static product
const productImageUrl = computed(() => {
  if (product.value) {
    return product.value.img
  }
  return '/assets/images/products/glp1.png' // fallback
})

const productName = computed(() => {
  if (product.value) {
    return product.value.name
  }
  return 'Serenova GLP-1 Injection' // fallback
})

const productPrice = computed(() => {
  if (product.value && product.value.prices.monthly) {
    return product.value.prices.monthly.toString()
  }
  return '129' // fallback
})

const productDescription = computed(() => {
  if (product.value) {
    return product.value.description
  }
  return 'Lose weight fast with our personalized medication.' // fallback
})

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-white'
  return resolveColorToken(heading.value.color, 'text')
})

const subheadingColorClass = computed(() => {
  if (!subheading.value?.color) return 'text-white'
  return resolveColorToken(subheading.value.color, 'text')
})

const bodyTextColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'text')
})

// Button background color
const buttonBackgroundColor = computed(() => {
  return productCard.value?.button?.color || 'accentColor1'
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
