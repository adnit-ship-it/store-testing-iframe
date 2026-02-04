<template>
  <div
    ref="carouselContainer"
    :class="[
      'relative flex flex-col md:flex-row items-center w-full lg:h-[460px] border-t border-b border-l border-[#D9D9D9] overflow-hidden scrollbar-hide',
      showNavigation ? 'justify-start' : 'justify-center'
    ]">
    <div v-for="(item, index) in items" :ref="el => { if (el) cardRefs[index] = el }" v-motion :initial="{ opacity: 0, y: 100 }" :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        duration: 500,
        type: 'ease-in',
        stiffness: 250,
        damping: 25,
        mass: 1,
        delay: 50 * index,
      },
    }" :key="item.productName || index" :class="[
      'w-[300px] flex h-[350px] md:w-[340px] md:h-[390px] lg:h-[460px] lg:w-[405px] p-6 md:p-5 lg:p-7 border-x md:border-l-0 lg:border-b-0 lg:border-l-0 first:border-l ',
      index === currentIndex ? 'block' : 'hidden md:block',
    ]" @click="onCardClick(item)">
      <slot :item="item">
        <UiProductCard :image-src="item.imageSrc" :image-alt="item.imageAlt" :product-name="item.productName"
          :price="item.price" :is-best-seller="item.isBestSeller" />
      </slot>
    </div>

    <button v-if="showNavigation" type="button" :disabled="currentIndex === 0" :style="isDesktop ? { top: buttonTop + 'px' } : {}" :class="[
      'group absolute inset-y-0 left-1 sm:left-[5rem] z-10 flex items-center justify-center transition-all duration-200 ease-out',
      'md:fixed md:-translate-y-1/2 md:inset-y-auto',
    ]" aria-label="Previous item" @click="prev">
      <span v-show="currentIndex > 0"
        class="pointer-events-none w-8 h-8 sm:w-9 sm:h-9 grid place-items-center transition-all duration-200 ease-out group-active:scale-95">
        <slot name="prev-icon">
          <svg class="h-full w-full rotate-180" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L8 7.66667L1 15" stroke="#787878" stroke-width="1.5" />
          </svg>
        </slot>
      </span>
    </button>
    <button v-if="showNavigation" type="button" :disabled="currentIndex === items.length - 1" :style="isDesktop ? { top: buttonTop + 'px' } : {}" :class="[
      'group absolute inset-y-0 right-1 sm:right-[5rem] z-10 flex items-center justify-center transition-all duration-200 ease-out',
      'md:fixed md:-translate-y-1/2 md:inset-y-auto',
    ]" aria-label="Next item" @click="next">
      <span v-show="currentIndex < items.length - 1"
        class="pointer-events-none w-8 h-8 9:w-10 sm:h-9 grid place-items-center transition-all duration-200 ease-out group-active:scale-95">
        <slot name="next-icon">
          <svg class="h-full w-full" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L8 7.66667L1 15" stroke="#787878" stroke-width="1.5" />
          </svg>
        </slot>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["item-click"]);

const currentIndex = ref(0);
const carouselContainer = ref(null);
const cardRefs = ref({});
const buttonTop = ref(0);
const isDesktop = ref(false);
const showNavigation = ref(false);

const getCardWidth = () => {
  const width = window.innerWidth;
  if (width >= 1024) return 405; // lg
  if (width >= 768) return 340; // md
  return 300; // mobile
};

const checkIfNavigationNeeded = () => {
  if (!carouselContainer.value || !isDesktop.value) {
    // On mobile, always show navigation if there are items
    showNavigation.value = props.items.length > 1;
    return;
  }

  const container = carouselContainer.value;
  const containerWidth = container.clientWidth;
  const scrollWidth = container.scrollWidth;
  
  // Check if content overflows
  showNavigation.value = scrollWidth > containerWidth;
};

const updateButtonPosition = () => {
  if (carouselContainer.value && isDesktop.value) {
    const rect = carouselContainer.value.getBoundingClientRect();
    buttonTop.value = rect.top + rect.height / 2;
  }
  checkIfNavigationNeeded();
};

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 768; // md breakpoint
  updateButtonPosition();
};

let resizeObserver = null;

onMounted(() => {
  checkDesktop();
  updateButtonPosition();
  checkIfNavigationNeeded();
  window.addEventListener('scroll', updateButtonPosition);
  window.addEventListener('resize', () => {
    checkDesktop();
    updateButtonPosition();
    checkIfNavigationNeeded();
  });
  
  // Use ResizeObserver to detect when carousel content changes
  if (carouselContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      checkIfNavigationNeeded();
    });
    resizeObserver.observe(carouselContainer.value);
  }
});

// Watch for items changes
watch(() => props.items, () => {
  nextTick(() => {
    checkIfNavigationNeeded();
  });
}, { deep: true });

onUnmounted(() => {
  window.removeEventListener('scroll', updateButtonPosition);
  window.removeEventListener('resize', checkDesktop);
  if (resizeObserver && carouselContainer.value) {
    resizeObserver.unobserve(carouselContainer.value);
    resizeObserver.disconnect();
  }
});

const scrollToCard = async (index) => {
  if (!isDesktop.value) return; // Only scroll on desktop
  await nextTick();
  const card = cardRefs.value[index];
  if (card && carouselContainer.value) {
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
};

const prev = async () => {
  const step = isDesktop.value ? 2 : 1
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(0, currentIndex.value - step);
    await scrollToCard(currentIndex.value);
  }
};
const next = async () => {
  const step = isDesktop.value ? 2 : 1;
  if (currentIndex.value < props.items.length - 1) {
    currentIndex.value = Math.min(props.items.length - 1, currentIndex.value + step);
    await scrollToCard(currentIndex.value);
  }
};

const onCardClick = (item) => {
  emit("item-click", item);
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
