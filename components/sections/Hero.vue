<template>
  <UiSectionWrapper class="relative text-black pt-24 lg:pt-32 pb-52">
    <!-- Background Image -->
    <div v-if="media?.background?.src" class="absolute inset-0 bg-cover bg-no-repeat w-full h-full" :style="{
        backgroundImage: `url('${media?.background?.src}')`,
        backgroundPosition: 'bottom right'
      }" />

    <!-- Gradient Overlay -->
    <div class="absolute w-full h-[256px] -bottom-[128px] z-[1]" style="
        background: linear-gradient(to bottom, rgba(98, 98, 98, 0) 0%, rgba(0, 0, 0, 1) 100%);
      "></div>

    <!-- Hand Vial Image - Bottom Right -->
    <div
      class="absolute md:hidden bottom-8 right-0 z-20 flex items-end justify-end"
      :style="{ height: foregroundHeightMobile }">
      <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 500,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
          }" :src="media?.foreground?.src" :alt="media?.foreground?.alt" class="h-full w-auto object-contain" />
    </div>

    <!-- Content - Single Column -->
    <UiSectionContainer class="relative z-30 h-full flex justify-between">
      <div class="space-y-2 md:space-y-4 lg:space-y-10 flex flex-col h-full">
        <div v-if="logo?.show !== false" :style="{ height: logoHeight, width: logoWidth }">
          <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
            },
          }" :src="logo?.src" class="h-full w-full object-cover" :alt="logo?.alt" />
        </div>

        <h1 v-if="heading?.show !== false" v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 50,
          },
        }" :class="[
          'text-2xl md:text-3xl lg:text-[48px] font-bold',
          headingColorClass
        ]">
          {{ heading?.text }}
        </h1>

        <h2 v-if="subheading?.show !== false" v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 100,
          },
        }" :class="[
          'text-lg md:text-xl lg:text-[34px]',
          subheadingColorClass
        ]">
          {{ subheading?.text }}
        </h2>

        <!-- Bullet Points -->
        <ul v-if="bulletPoints?.show !== false && bulletPointsItems.length > 0" class="space-y-3">
          <li v-for="(item, index) in bulletPointsItems" :key="index" v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 150 + (index * 50),
            },
          }" class="flex items-center h-[16px] md:h-[26px]">
            <UiIcon 
              :src="bulletPointIconSrc" 
              :icon-color="bulletPointIconColor"
              size="w-[14px] h-[14px] md:w-[26px] md:h-[26px]"
              class="mr-1 md:mr-3"
              alt="Checkmark"
            />
            <span :class="[
              'text-[16px] md:text-[20px] lg:text-[24px] font-medium',
              bulletPointTextColorClass
            ]">{{ item }}</span>
          </li>
        </ul>

        <!-- CTA Button -->
        <div v-if="ctaButton?.show !== false" v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
            delay: 200,
          },
        }" class="flex flex-col justify-end h-[50px] mt-7 lg:mt-5">
          <NuxtLink to="/consultation">
            <UiButton 
              :background-color="ctaButtonBackgroundColor" 
              :text-color="ctaButtonTextColor" 
              :width="buttonWidth" 
              :height="buttonHeight"
              :font-size="buttonFontSize"
            >
              {{ ctaButton?.text }}
            </UiButton>
          </NuxtLink>
        </div>
      </div>
      <div v-if="media?.foreground?.src" class="hidden md:block z-20" :style="{ height: foregroundHeightDesktop }">
        <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 500,
            type: 'ease-in',
            stiffness: 250,
            damping: 25,
            mass: 1,
          },
        }" :src="media?.foreground?.src" :alt="media?.foreground?.alt" class="h-full w-auto object-contain" />
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { resolveColorToken, resolveIconColor, resolveBackgroundColor } from "~/utils/colorTokens";
import { getLogoSize } from '~/utils/branding';

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
const logo = computed(() => props.sectionData?.logo)
const media = computed(() => props.sectionData?.media)
const bulletPoints = computed(() => props.sectionData?.bulletPoints)
const ctaButton = computed(() => props.sectionData?.ctaButton)

// Get icon color directly from bulletPoints config
const bulletPointIconColor = computed(() => {
  const iconColorToken = bulletPoints.value?.icon?.color
  if (!iconColorToken) return null
  return resolveIconColor(iconColorToken)
})

// Get icon path from bulletPoints config
const bulletPointIconSrc = computed(() => {
  return bulletPoints.value?.icon?.src || ''
})

// Responsive heights
const foregroundHeightMobile = computed(() => media.value?.foreground?.sizes?.mobile || '222px');
const foregroundHeightTablet = computed(() => media.value?.foreground?.sizes?.tablet || '480px');
const foregroundHeightDesktop = computed(() => {
  if (!process.client) return media.value?.foreground?.sizes?.desktop || '600px';
  if (isMobile.value) return foregroundHeightMobile.value;
  if (window.innerWidth >= 1024) return media.value?.foreground?.sizes?.desktop || '600px';
  return foregroundHeightTablet.value;
});

// Mobile detection
const isMobile = ref(false);
const isTablet = ref(false);

// Check mobile on mount and resize
const checkMobile = () => {
  const width = window.innerWidth;
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;
};

const logoHeight = computed(() => getLogoSize('hero', 'height', isMobile.value, isTablet.value));
const logoWidth = computed(() => getLogoSize('hero', 'width', isMobile.value, isTablet.value));

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Derived button sizes
const buttonWidth = computed(() => (isMobile.value ? "192px" : "320px"));
const buttonHeight = computed(() => (isMobile.value ? "28px" : "48px"));
const buttonFontSize = computed(() => (isMobile.value ? "16" : "24"));

// Bullet points items
const bulletPointsItems = computed(() => {
  return bulletPoints.value?.items || []
})

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

const subheadingColorClass = computed(() => {
  if (!subheading.value?.color) return 'text-bodyColor'
  return resolveColorToken(subheading.value.color, 'text')
})

const bulletPointTextColorClass = computed(() => {
  // Bullet point text color - default to accentColor1
  return resolveColorToken('accentColor1', 'text')
})

// CTA Button background color - just get the token from sections.json
const ctaButtonBackgroundColor = computed(() => {
  // Get backgroundColor from sections.json, fallback to color, then default
  return ctaButton.value?.backgroundColor ||  'accentColor2'
})

// CTA Button text color - get from sections.json
const ctaButtonTextColor = computed(() => {
  // Get color from sections.json for text color, default to white
  return ctaButton.value?.color || 'white'
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
