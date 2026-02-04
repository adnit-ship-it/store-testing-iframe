<template>
  <UiSectionWrapper class="flex-col py-20">
    <UiSectionContainer class="flex-col">
      <!-- Move ref here to the actual content -->
      <div ref="sectionRef">
        <!-- Heading -->
        <h2 
          v-if="heading?.show !== false"
          v-motion 
          :initial="{ opacity: 0, y: 32 }" 
          :visible-once="{
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
          }"
          :class="[
            'w-full text-[20px] md:text-[28px] lg:text-[32px] mb-9 md:mb-12 font-semibold text-center',
            headingColorClass
          ]"
        >
          {{ heading?.text }}
        </h2>

        <!-- Content Container -->
        <div class="flex flex-row lg:flex-col gap-8 px-8 lg:px-0 max-w-[1168px] w-full">
          <div class="flex flex-col items-center lg:hidden py-10 relative">
            <div 
              class="progress-line absolute top-12 w-[1px] max-h-[224px]"
              :style="{ height: progressHeight + 'px', backgroundColor: progressLineColor }"
            ></div>
            <!-- First dot (always filled) -->
            <div 
              class="h-2 w-2 md:h-3 md:w-3 rounded-full" 
              :style="{ backgroundColor: progressDotsColor }" 
            />
            <!-- Dynamic dots and spacers for remaining steps -->
            <template v-for="(step, stepIndex) in steps.slice(1)" :key="stepIndex">
              <div :class="['h-[108px] md:h-[152px] w-[1px] md:w-[2px]', borderColorClass]"></div>
              <div 
                :class="[
                  'h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300',
                  progress >= (currentThresholds[stepIndex + 1] || 0) ? 'border-0' : borderColorClass + ' border md:border-2',
                ]" 
                :style="progress >= (currentThresholds[stepIndex + 1] || 0) ? { backgroundColor: progressDotsColor } : {}" 
              />
            </template>
          </div>
          <div class="w-full flex flex-col lg:flex-row gap-7 pl-4 flex-wrap justify-center items-center">
            <UiJourneyCard v-motion :initial="{ opacity: 0, y: 8 }" :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in-out',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 100 * index,
              },
            }" v-for="(card, index) in journeyCards" :key="index" :img="card.img" :title="card.title"
              :subtext="card.subtext" :is-active="index === 0" :isActive="card.isActive" :icon-color="card.iconColor" />
          </div>
        </div>
      </div>
    </UiSectionContainer>
    <div class="hidden lg:flex w-full h-[1px] mt-8 justify-center" :style="{ backgroundColor: progressLineColor }">
      <UiSectionContainer class="flex flex-row justify-around">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="h-2 w-2 rounded-full -mt-[3px]" 
          :style="{ backgroundColor: progressDotsColor }" 
        />
      </UiSectionContainer>
    </div>
    <NuxtLink v-if="button?.show !== false" to="/consultation" class="mt-16">
      <UiButton 
        text-color="white" 
        :background-color="buttonBackgroundColor" 
        width="229px"
      >
        {{ button?.text }}
      </UiButton>
    </NuxtLink>
    
  </UiSectionWrapper>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
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
const steps = computed(() => props.sectionData?.steps || [])
const button = computed(() => props.sectionData?.button)
const media = computed(() => props.sectionData?.media)

// Get progress line color - default to accentColor1 if not specified
const progressLineColor = computed(() => {
  const colorToken = media.value?.progressLine?.color || 'accentColor1'
  return resolveIconColor(colorToken)
})

// Get progress dots color - default to accentColor1 if not specified
const progressDotsColor = computed(() => {
  const colorToken = media.value?.progressDots?.color || 'accentColor1'
  return resolveIconColor(colorToken)
})

// Get icon colors directly from steps array
const getStepIconColor = (stepIndex) => {
  const step = steps.value[stepIndex]
  const colorToken = step?.icon?.color
  if (!colorToken) return resolveIconColor('#A75809') // Default from sections.json
  return resolveIconColor(colorToken)
}

const journeyCards = computed(() => {
  return steps.value.map((step, index) => ({
    img: step.icon?.src,
    title: step.title,
    subtext: Array.isArray(step.subtext) ? step.subtext.join('<br class="hidden md:block" />') : step.subtext,
    iconColor: getStepIconColor(index),
    isActive: false,
  }))
});

const progressHeight = ref(0);
const progress = ref(0);
const sectionRef = ref(null);

// Calculate thresholds dynamically based on number of steps
const dotThresholds = computed(() => {
  const stepCount = steps.value.length
  if (stepCount <= 1) return [0]
  // Distribute thresholds evenly across progress (0 to 1)
  return Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1))
})

// Tablet-specific values (768px - 1076px)
const tabletDotThresholds = computed(() => {
  const stepCount = steps.value.length
  if (stepCount <= 1) return [0]
  // Distribute thresholds evenly for tablet
  return Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1))
})
const tabletProgressHeight = 640; // Tablet progress line height
const mobileProgressHeight = 456; // Mobile progress line height

// Current thresholds based on screen size (reactive)
const isTablet = ref(false)
const currentThresholds = computed(() => {
  return isTablet.value ? tabletDotThresholds.value : dotThresholds.value
})

const updateProgress = () => {
  if (window.innerWidth > 1076) return; // Desktop only

  const section = sectionRef.value;
  if (!section || typeof section.getBoundingClientRect !== 'function') return;

  // Update tablet state
  isTablet.value = window.innerWidth >= 768

  const rect = section.getBoundingClientRect();
  const sectionTop = rect.top;
  const sectionHeight = rect.height;
  const viewportHeight = window.innerHeight;

  // Control when animation starts and ends
  const startPoint = 0.2; // Start at 20% scroll
  const endPoint = 0.8; // End at 80% scroll

  if (sectionTop <= viewportHeight * (1 - startPoint)) {
    const rawProgress =
      (viewportHeight - sectionTop) / (sectionHeight + viewportHeight);
    progress.value = Math.max(
      0,
      Math.min(1, (rawProgress - startPoint) / (endPoint - startPoint))
    );

    const currentProgressHeight = isTablet.value ? tabletProgressHeight : mobileProgressHeight;
    const thresholds = currentThresholds.value;

    // Update journey card active states based on progress thresholds
    journeyCards.value.forEach((card, index) => {
      if (index === 0) return; // First card always active

      const threshold = thresholds[index];
      const wasActive = card.isActive;
      const isNowActive = progress.value >= threshold;

      if (isNowActive !== wasActive) {
        card.isActive = isNowActive;
      }
    });

    // Update progress height based on screen size
    progressHeight.value = progress.value * currentProgressHeight;
  } else {
    progress.value = 0;
    // Reset all cards to inactive except first
    journeyCards.value.forEach((card, index) => {
      card.isActive = index === 0;
    });
  }
};



onMounted(() => {
  // Wait for next tick to ensure refs are properly set
  nextTick(() => {
    // Mobile/tablet animation
    if (window.innerWidth <= 1076) {
      window.addEventListener("scroll", updateProgress);
      window.addEventListener("resize", updateProgress);
      updateProgress(); // Initial call
    }


  });

  // Handle resize to switch between animations
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  // Remove all listeners first
  window.removeEventListener("scroll", updateProgress);

  // Add appropriate listener based on new screen size
  if (window.innerWidth <= 1076) {
    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial call
  }
};

// Computed property for template access
const isDesktop = computed(() => process.client && window.innerWidth > 1076);

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

// Map hardcoded border color to base color
// border-[#DBD9D9] and bg-[#d9d9d9] are light gray, closest to bodyColor
const borderColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'border')
})

// Button background color
const buttonBackgroundColor = computed(() => {
  return button.value?.color || 'accentColor1'
})

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
  window.removeEventListener("resize", updateProgress);
});
</script>

<style scoped>
/* Mobile-only progress line animation */
@media (max-width: 1076px) {
  .progress-line {
    transition: height 0.1s ease-out;
  }
}

/* Tablet-specific progress line animation (768px - 1076px) */
@media (min-width: 768px) and (max-width: 1076px) {
  .progress-line {
    transition: height 0.15s ease-out;
    /* Slightly slower for tablet */
  }
}

/* Mobile-specific progress line animation (below 768px) */
@media (max-width: 767px) {
  .progress-line {
    transition: height 0.1s ease-out;
    /* Faster for mobile */
  }
}
</style>
