<template>
  <UiSectionWrapper class="flex-col py-20">
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
          delay: 100,
        },
      }" class="pb-[24px] font-defaultSerif text-[20px] md:text-[28px] lg:text-[32px] font-semibold text-black">
        {{ reviewsText?.title }}
      </h2>
    </UiSectionContainer>


    <div class="w-full flex flex-col gap-5 md:gap-8">
      <NuxtMarquee  v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
          delay: 100,
        },
      }"  :speed="marqueeSpeed || 50" :autoFill="true" class="flex gap-8">
        <div class="flex gap-5 md:gap-8">
          <div v-for="review in topReviews" :key="`top-${review.name}`"
            :class="[
              'min-w-[320px] md:min-w-[492px] max-w-[320px] md:max-w-[492px] h-[136px] md:h-[188px] rounded-[16px] md:rounded-[28px] p-2 md:p-4 flex flex-col gap-5 md:gap-8',
              cardBackgroundClass,
              cardBorderClass
            ]">
            <div class="flex items-center justify-between">
              <div class="flex gap-[6px] items-center">
                <UiIcon 
                  :src="reviewsText?.media?.avatar?.src" 
                  :icon-color="reviewsText?.media?.avatar?.color"
                  size="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                  :alt="reviewsText?.media?.avatar?.alt"
                />
                <p class="text-accentColor1 text-[16px] md:text-[24px] font-medium">
                  {{ review.name }}
                </p>
              </div>
              <div class="flex gap-1.5 md:gap-3">
                <UiIcon 
                  v-for="star in review.stars" 
                  :key="star"
                  :src="reviewsText?.media?.star?.src" 
                  :icon-color="reviewsText?.media?.star?.color"
                  size="w-[22px] h-[22px] md:w-[28px] md:h-[28px]"
                  :alt="reviewsText?.media?.star?.alt"
                />
              </div>
            </div>
            <p class="text-[16px] md:text-[24px] text-center leading-tight px-2"
              style="white-space: normal !important; word-wrap: break-word !important;">
              "{{ review.review }}"
            </p>
          </div>
        </div>
      </NuxtMarquee>

      <NuxtMarquee  v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
          delay: 100,
        },
      }"  :speed="marqueeSpeed || 50" :direction="'right'" :autoFill="true" class="flex gap-8">
        <div class="flex gap-5 md:gap-8">
          <div v-for="review in bottomReviews" :key="`bottom-${review.name}`"
            :class="[
              'min-w-[320px] md:min-w-[492px] max-w-[320px] md:max-w-[492px] h-[136px] md:h-[188px] rounded-[16px] md:rounded-[28px] p-2 md:p-4 flex flex-col gap-5 md:gap-8',
              cardBackgroundClass,
              cardBorderClass
            ]">
            <div class="flex items-center justify-between">
              <div class="flex gap-[6px] items-center">
                <UiIcon 
                  :src="media?.avatar?.src" 
                  :icon-color="avatarIconColor"
                  size="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                  :alt="media?.avatar?.alt"
                />
                <p :class="[
                  'text-[16px] md:text-[24px] font-medium',
                  resolveColorToken('accentColor1', 'text')
                ]">
                  {{ review.name }}
                </p>
              </div>
              <div class="flex gap-1.5 md:gap-3">
                <UiIcon 
                  v-for="star in review.stars" 
                  :key="star"
                  :src="media?.star?.src" 
                  :icon-color="starIconColor"
                  size="w-[22px] h-[22px] md:w-[28px] md:h-[28px]"
                  :alt="media?.star?.alt"
                />
              </div>
            </div>
            <p class="text-[16px] md:text-[24px] text-center leading-tight px-2"
              style="white-space: normal !important; word-wrap: break-word !important;">
              "{{ review.review }}"
            </p>
          </div>
        </div>
      </NuxtMarquee>
    </div>
  </UiSectionWrapper>

</template>

<script setup>
import { computed } from 'vue'
import { resolveColorToken, resolveIconColor } from '~/utils/colorTokens'

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const marqueeSpeed = computed(() => props.sectionData?.marqueeSpeed)
const media = computed(() => props.sectionData?.media)

// Get icon colors directly from media config
const avatarIconColor = computed(() => {
  const colorToken = media.value?.avatar?.color
  if (!colorToken) return null
  return resolveIconColor(colorToken)
})

const starIconColor = computed(() => {
  const colorToken = media.value?.star?.color
  if (!colorToken) return null
  return resolveIconColor(colorToken)
})

// Note: Reviews section doesn't have reviews list in sections.json yet
// For now, using empty array, but structure is ready for sections.json data
const reviewsList = computed(() => {
  // If sections.json has reviews list in the future, use it here
  return []
})

// Split reviews into two arrays for top and bottom rows
const topReviews = computed(() => reviewsList.value.slice(0, Math.ceil(reviewsList.value.length / 2)))
const bottomReviews = computed(() => reviewsList.value.slice(Math.ceil(reviewsList.value.length / 2)))

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-black'
  return resolveColorToken(heading.value.color, 'text')
})

// Card styling classes
const cardBackgroundClass = computed(() => {
  return resolveColorToken('backgroundColor', 'bg')
})

const cardBorderClass = computed(() => {
  return resolveColorToken('accentColor1', 'border') + ' border'
})
</script>
