<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { UiSectionWrapper, UiSectionContainer } from '#components';
import { resolveColorToken } from '~/utils/colorTokens';
import { getLogoSize } from '~/utils/branding';

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const logo = computed(() => props.sectionData?.logo)
const heading = computed(() => props.sectionData?.heading)
const subheading = computed(() => props.sectionData?.subheading)
const paragraph = computed(() => props.sectionData?.paragraph)
const media = computed(() => props.sectionData?.media)

console.log('props.sectionData,', props.sectionData)

// Mobile detection
const isMobile = ref(false);
const isTablet = ref(false);

const checkBreakpoints = () => {
  if (!process.client) return;
  const width = window.innerWidth;
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;
};

const logoHeight = computed(() => getLogoSize('hero', 'height', isMobile.value, isTablet.value));
const logoWidth = computed(() => getLogoSize('hero', 'width', isMobile.value, isTablet.value));

onMounted(() => {
  checkBreakpoints();
  window.addEventListener("resize", checkBreakpoints);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkBreakpoints);
});

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-accentColor1'
  return resolveColorToken(heading.value.color, 'text')
})

const subheadingColorClass = computed(() => {
  if (!subheading.value?.color) return 'text-bodyColor'
  return resolveColorToken(subheading.value.color, 'text')
})

const paragraphColorClass = computed(() => {
  if (!paragraph.value?.color) return 'text-bodyColor'
  return resolveColorToken(paragraph.value.color, 'text')
})
</script>

<template>
    <UiSectionWrapper class="py-20">
        <UiSectionContainer>
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
            }" 
                v-if="logo?.show !== false"
                :src="logo?.src" 
                :alt="logo?.alt"
                class="object-cover mx-auto " 
                :style="{ height: logoHeight, width: logoWidth }"
            />
            <div class="w-full flex flex-col md:flex-row gap-8 lg:gap-20 items-center mt-12 md:mt-6">
                <div class="flex-1 h-full flex flex-col gap-2 lg:gap-6">
                    <h1 v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
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
                        'font-semibold text-[32px] lg:text-[48px] mb-2 lg:mb-4',
                        headingColorClass
                    ]">
                        {{ heading?.text || 'About Us' }}
                    </h1>
                    <h2 
                        v-if="subheading?.show !== false"
                        v-motion 
                        :initial="{ opacity: 0, y: 100 }" 
                        :visible-once="{
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
                        }" 
                        :class="[
                            'font-semibold text-[24px] lg:text-[34px]',
                            subheadingColorClass
                        ]"
                    >
                        {{ subheading?.text || 'Quality is our guarantee!' }}
                    </h2>
                    <p 
                        v-if="paragraph?.show !== false"
                        v-motion 
                        :initial="{ opacity: 0, y: 100 }" 
                        :visible-once="{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 500,
                                type: 'ease-in',
                                stiffness: 250,
                                damping: 25,
                                mass: 1,
                                delay: 150,
                            },
                        }" 
                        :class="[
                            'text-[24px] lg:text-[34px] font-light',
                            paragraphColorClass
                        ]"
                    >
                        {{ paragraph?.text || 'Serenova works to change the game in the health and wellness space allowing for certified medical care, made simple and effective.' }}
                    </p>
                </div>
                <div class="w-[160px] lg:w-[288px] h-full">
                    <img v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 500,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 0,
            },
          }" src="/assets/images/products-alt.png" alt="products" class="w-full h-full object-cover" />
                </div>
            </div>
        </UiSectionContainer>
    </UiSectionWrapper>
</template>

