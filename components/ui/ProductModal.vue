<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/15 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Modal Container -->
    <div
      class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close modal"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <!-- Product Image -->
      <div class="p-6 pb-4">
        <img
          :src="product?.imageUrl || product?.imageSrc"
          :alt="product?.productName || product?.name"
          class="w-full h-48 object-contain rounded-lg"
        />
      </div>

      <!-- Product Details -->
      <div class="px-6 pb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">
          {{ product?.productName || product?.name }}
        </h2>
        <p class="text-gray-600 mb-6 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <!-- See if I qualify button -->
        <NuxtLink
          :to="consultationHref"
          @click="handleConsultationClick"
          class="block w-full"
        >
          <button
            class="w-full bg-accentColor1 text-white font-semibold py-3 px-6 rounded-lg hover:bg-accentColor1/90 transition-colors"
          >
            See if I qualify
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string;
  imageUrl?: string;
  productName?: string;
  name?: string; // Alternative property name
  price?: string;
  isBestSeller?: boolean;
  productBundleIds?: {
    monthly?: string;
    threeMonthly?: string;
    sixMonthly?: string;
    semiannually?: string;
  };
  quizId?: string;
  [key: string]: any; // Allow any additional properties
}

interface Props {
  isOpen: boolean;
  product: Product | null;
}

interface Emits {
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const consultationHref = computed(() => {
  if (!props.product) {
    return "/consultation";
  }
  
const productId = props.product.id;
  return `/consultation?productId=${productId}`;
});

const closeModal = () => {
  // Re-enable scrolling before closing
  document.body.style.overflow = "unset";
  emit("close");
};

const handleConsultationClick = () => {
  // Re-enable scrolling when navigating to consultation
  document.body.style.overflow = "unset";
};

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) {
      closeModal();
    }
  };

  document.addEventListener("keydown", handleEscape);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
    // Ensure scrolling is re-enabled when component is unmounted
    document.body.style.overflow = "unset";
  });
});

// Disable body scroll when modal is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "unset";
    }
  },
);

// Ensure scrolling is re-enabled when component is unmounted
onUnmounted(() => {
  document.body.style.overflow = "unset";
});
</script>
