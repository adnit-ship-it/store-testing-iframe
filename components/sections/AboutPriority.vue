<script setup lang="ts">
import { computed } from 'vue';
import { resolveColorToken, resolveIconColor } from '~/utils/colorTokens';

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const bulletPoints = computed(() => props.sectionData?.bulletPoints)
const infoCard = computed(() => props.sectionData?.infoCard)
const infoCardWithBulletpoint = computed(() => props.sectionData?.['infoCard with bulletpoint'])

// Get icon color directly from bulletPoints config
const bulletPointIconColor = computed(() => {
  const iconColorToken = bulletPoints.value?.icon?.color
  if (!iconColorToken) return null
  return resolveIconColor(iconColorToken)
})

const bulletPointIconSrc = computed(() => {
  return bulletPoints.value?.icon?.src || ''
})

// Bullet points items
const bulletPointsItems = computed(() => {
  return bulletPoints.value?.items || []
})

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})
</script>

<template>
    <UiSectionWrapper class="pb-8 md:pb-20 pt-6 md:pt-2">
        <UiSectionContainer class="flex flex-col items-start">
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
            }" :class="[
                'text-[20px] lg:text-[32px] w-full text-left font-semibold',
                headingColorClass
            ]">
                {{ heading?.text || 'Your Satisfaction Is Our Priority' }}
            </h2>
            <div class="mt-6 lg:mt-10 flex flex-col md:flex-row gap-4 md:justify-between w-full px-8 lg:px-0">
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 150,
                    },
                }" class="flex flex-row gap-2 items-center">
                    <UiIcon 
                        v-if="bulletPointIconSrc"
                        :src="bulletPointIconSrc" 
                        :icon-color="bulletPointIconColor"
                        size="w-[28px] h-[28px]"
                        alt="checkmark"
                    />
                    <p class="text-[16px] lg:text-[20px] font-medium">{{ bulletPointsItems[0] || 'No Hidden Fees' }}</p>
                </div>
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 200,
                    },
                }" class="flex flex-row gap-2 items-center">
                    <UiIcon 
                        v-if="bulletPointIconSrc"
                        :src="bulletPointIconSrc" 
                        :icon-color="bulletPointIconColor"
                        size="w-[28px] h-[28px]"
                        alt="checkmark"
                    />
                    <p class="text-[16px] lg:text-[20px] font-medium">
                        {{ bulletPointsItems[1] || 'Expedited Delivery' }}
                    </p>
                </div>
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 250,
                    },
                }" class="flex flex-row gap-2 items-center">
                    <UiIcon 
                        v-if="bulletPointIconSrc"
                        :src="bulletPointIconSrc" 
                        :icon-color="bulletPointIconColor"
                        size="w-[28px] h-[28px]"
                        alt="checkmark"
                    />
                    <p class="text-[16px] lg:text-[20px] font-medium">
                        {{ bulletPointsItems[2] || 'Doctor-led Plans & Coaching' }}
                    </p>
                </div>
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 300,
                    },
                }" class="flex flex-row gap-2 items-center">
                    <UiIcon 
                        v-if="bulletPointIconSrc"
                        :src="bulletPointIconSrc" 
                        :icon-color="bulletPointIconColor"
                        size="w-[28px] h-[28px]"
                        alt="checkmark"
                    />
                    <p class="text-[16px] lg:text-[20px] font-medium">
                        {{ bulletPointsItems[3] || 'Money Back Guarantee' }}
                    </p>
                </div>
            </div>
            <div
                class="pb-12 lg:pb-0 px-8 lg:px-0 mt-12 lg:mt-16 flex flex-col md:flex-row gap-8 justify-center md:justify-around w-full">
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 350,
                    },
                }" class="flex flex-col items-center max-w-[400px]">
                    <h3 :class="[
                        'text-[20px] lg:text-[24px] font-semibold text-left md:text-center w-full',
                        resolveColorToken('accentColor1', 'text')
                    ]">
                        {{ infoCard?.title || 'Unlimited 24/7 Support Included' }}
                    </h3>
                    <div :class="[
                        'h-0.5 w-10 mt-0',
                        resolveColorToken('accentColor1', 'bg')
                    ]"></div>
                    <p class="font-medium mt-4 tracking-tight w-full text-left md:text-center">
                        {{ infoCard?.description || 'Serenova provides 24/7 access to a dedicated team of specialists, ensuring you have the support you need around the clock. With unlimited appointments, messaging and support, you can confidently reach out for guidance, ask questions, or address concerns at any time.' }}
                    </p>
                </div>
                <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 400,
                        type: 'ease-in',
                        stiffness: 250,
                        damping: 25,
                        mass: 1,
                        delay: 350,
                    },
                }" class="flex flex-col items-center max-w-[400px]">
                    <h3 :class="[
                        'text-[20px] lg:text-[24px] font-semibold text-left md:text-center w-full',
                        resolveColorToken('accentColor1', 'text')
                    ]">
                        {{ infoCardWithBulletpoint?.title || 'Hand Selected Providers' }}
                    </h3>
                    <div :class="[
                        'h-0.5 w-10 mt-0',
                        resolveColorToken('accentColor1', 'bg')
                    ]"></div>
                    <p class="font-medium mt-4 w-full text-left md:text-center">
                        {{ infoCardWithBulletpoint?.description || 'Serenova physicians are here to guide you every step of the way, bringing both their expertise and genuine care to keep you supported.' }}
                    </p>
                    <div v-if="infoCardWithBulletpoint?.bulletpoints?.length > 0" class="flex flex-row gap-4 w-full justify-start md:justify-center items-center mt-2">
                        <UiIcon 
                            v-if="infoCardWithBulletpoint?.bulletpointIcon?.src"
                            :src="infoCardWithBulletpoint.bulletpointIcon.src" 
                            :icon-color="infoCardWithBulletpoint.bulletpointIcon.color ? resolveIconColor(infoCardWithBulletpoint.bulletpointIcon.color) : null"
                            size="w-[28px] h-[28px]"
                            alt="checkmark"
                        />
                        <p>{{ infoCardWithBulletpoint.bulletpoints[0]?.text || 'Certified doctors and clinicians' }}</p>
                    </div>
                </div>
            </div>
        </UiSectionContainer>
    </UiSectionWrapper>
</template>