<template>
  <div
    class="w-[250px] lg:w-[340px] h-[295px] md:h-[340px] lg:h-[400px] bg-white border border-bodyColor flex flex-col justify-end items-center relative cursor-pointer hover:shadow-lg transition-shadow"
    @click="handleClick"
  >
    <!-- Best Seller Flag -->
    <div v-if="isBestSeller && (!badgeConfig || badgeConfig.show !== false)" class="absolute top-3 left-3 z-10">
      <span
        :class="[
          'text-[12px] lg:text-[14px] rounded-full px-4 py-0.5 font-medium',
          badgeTextColor,
          typeof badgeBackgroundColor === 'string' ? badgeBackgroundColor : ''
        ]"
        :style="typeof badgeBackgroundColor === 'object' ? badgeBackgroundColor : {}"
      >
        Best Seller
      </span>
    </div>

    <!-- Product Image -->
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="max-h-full max-w-full object-cover"
    />

    <!-- Product Info Bar -->
    <div
      v-if="!titleBarConfig || titleBarConfig.show !== false"
      :class="[
        'w-full h-6 md:h-[40px] text-[12px] flex justify-between items-center px-2 md:px-4',
        titleBarTextColor
      ]"
      :style="titleBarBackgroundColor"
    >
      <p class="">{{ productName }}</p>
      <p class="">{{ price }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolveColorToken, resolveIconColor } from '~/utils/colorTokens'

// Define props for the component
const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  badgeConfig: {
    type: Object,
    default: null
  },
  titleBarConfig: {
    type: Object,
    default: null
  },
});

// Resolve badge colors
const badgeTextColor = computed(() => {
  if (!props.badgeConfig?.color) return 'text-black'
  return resolveColorToken(props.badgeConfig.color, 'text')
})

const badgeBackgroundColor = computed(() => {
  if (!props.badgeConfig?.backgroundColor) return 'bg-[#FAFAFA]'
  const bgColor = resolveIconColor(props.badgeConfig.backgroundColor)
  return bgColor ? { backgroundColor: bgColor } : 'bg-[#FAFAFA]'
})

// Resolve title bar colors
const titleBarTextColor = computed(() => {
  if (!props.titleBarConfig?.color) return 'text-bodyColor'
  return resolveColorToken(props.titleBarConfig.color, 'text')
})

const titleBarBackgroundColor = computed(() => {
  if (!props.titleBarConfig?.backgroundColor) return null
  const bgColor = resolveIconColor(props.titleBarConfig.backgroundColor)
  return bgColor ? { backgroundColor: bgColor } : null
})

// Define emits
const emit = defineEmits(["click"]);

// Handle click event
const handleClick = () => {
  emit("click", {
    imageSrc: props.imageSrc,
    productName: props.productName,
    price: props.price,
    isBestSeller: props.isBestSeller,
  });
};
</script>

<style scoped>
/* Component styles can be added here */
</style>
