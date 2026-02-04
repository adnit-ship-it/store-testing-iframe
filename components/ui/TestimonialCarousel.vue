<template>
  <div class="relative w-full border-t border-b border-[#d9d9d9] px-6 py-4">
    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center justify-center w-full max-w-6xl mx-auto">
      <!-- Before/After Image -->
      <div class="flex-1 max-w-md lg:max-w-lg">
        <img 
          :src="currentItem?.image" 
          :alt="currentItem?.alt" 
          class="w-auto h-[512px] max-h-[512px] min-h-[512px] object-cover"
        />
      </div>

      <!-- Testimonial -->
      <div class="flex-1 max-w-md lg:max-w-lg ml-8 lg:ml-12">
        <div class="flex items-center mb-4">
          <div class="flex">
            <svg v-for="star in currentItem?.stars" :key="star" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-700 text-lg leading-relaxed mb-6">
          "{{ currentItem?.testimonial }}"
        </p>
        <p class="text-gray-600 font-medium">-{{ currentItem?.name }}</p>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="md:hidden">
      <div class="relative">
        <!-- Before/After Image -->
        <div class="flex-1">
          <img 
            :src="currentItem?.image" 
            :alt="currentItem?.alt" 
            class="w-full h-auto object-cover"
          />
        </div>

        <!-- Testimonial -->
        <div class="mt-6">
          <div class="flex items-center mb-3">
            <div class="flex">
              <svg v-for="star in currentItem?.stars" :key="star" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p class="text-gray-700 text-base leading-relaxed mb-4">
            "{{ currentItem?.testimonial }}"
          </p>
          <p class="text-gray-600 font-medium text-sm">-{{ currentItem?.name }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows - Always Visible -->
     <div class="flex justify-center items-center">
       <UiSectionContainer class="absolute top-1/2 mx-auto">
        <button 
        @click="prev" 
        :disabled="currentIndex === 0"
        :class="[
          'absolute left-4 transform bg-white rounded-full lg:bg-transparent -translate-y-1/2 z-10 w-10 h-10 md:h-12 md:w-12 flex items-center justify-center transition-all duration-200',
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        ]"
        aria-label="Previous testimonial"
      >
        <svg class="w-6 h-6 md:w-10 md:h-10 text-bodyColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
  
      <button 
        @click="next" 
        :disabled="currentIndex === items.length - 1"
        :class="[
          'absolute right-4 transform bg-white rounded-full lg:bg-transparent -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-200',
          currentIndex === items.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        ]"
        aria-label="Next testimonial"
      >
        <svg class="w-6 h-6 md:w-10 md:h-10 text-bodyColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
       </UiSectionContainer>
     </div>
   
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TestimonialItem {
  image: string
  alt: string
  testimonial: string
  name: string
  stars: number
}

const props = defineProps<{
  items: TestimonialItem[]
}>()

const currentIndex = ref(0)

const currentItem = computed(() => props.items[currentIndex.value])

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const next = () => {
  if (currentIndex.value < props.items.length - 1) {
    currentIndex.value++
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}
</script> 