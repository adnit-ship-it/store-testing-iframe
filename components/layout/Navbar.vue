<template>
  <nav :class="[
    'w-full fixed top-0 z-50 flex justify-center shadow-lg',
    props.color || 'bg-white'
  ]">
    <div v-motion :initial="{ opacity: 0.3, y: 8 }" :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        duration: 400,
        type: 'ease-in',
        stiffness: 250,
        damping: 25,
        mass: 1,
      },
    }"       :class="[
        'lg:max-w-[1328px] w-full flex justify-center px-4 md:px-8 pb-2 md:pb-0',
        props.hideNavigation ? 'justify-center' : 'justify-between',
      ]"
      :style="{ height: navbarHeight }">
      <!-- Mobile hamburger menu on the left -->
      <button v-if="!props.hideNavigation" class="md:hidden rounded" :aria-label="common?.accessibility?.toggleMenu" @click="toggleMobileMenu">
        <img :src="common?.media?.hamburgerMenu?.src" :alt="common?.accessibility?.menu" class="h-4 w-4" />
      </button>

      <!-- Logo on center-->
      <div class="flex items-center">
        <NuxtLink to="/">
          <img :src="navbarLogoSrc" :alt="navbarLogoAlt" :style="{ height: logoHeight, width: logoWidth }" />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-10">

        <!-- Navigation links in middle -->
        <div v-if="!props.hideNavigation" class="hidden md:flex items-center gap-8">
          <NuxtLink 
            v-for="page in navigationPages" 
            :key="page.key"
            :to="pagesStore.getPageRoute(page.key)"
          >
            <p class="text-white text-lg font-medium">
              {{ page.title }}
            </p>
          </NuxtLink>
        </div>

        <!-- Get Started button on right -->
        <div v-if="!props.hideNavigation" class="flex flex-row items-center md:gap-3 relative">
          <NuxtLink to="/consultation" class="hidden md:block">
            <UiButton background-color="white" text-color="accentColor1" width="176px" height="32px" font-size="20">
              {{ common?.buttons?.getStarted }}
            </UiButton>
          </NuxtLink>
          <NuxtLink to="/consultation" class="block md:hidden">
            <UiButton background-color="white" text-color="accentColor1" width="144px" height="28px" font-size="18">
              {{ common?.buttons?.getStarted }}
            </UiButton>
          </NuxtLink>

          <!-- Mobile dropdown menu -->
          <div v-if="isMobileMenuOpen"
            class="lg:hidden absolute top-full right-36 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div class="py-2">
              <NuxtLink 
                v-for="page in navigationPages"
                :key="page.key"
                :to="pagesStore.getPageRoute(page.key)"
                class="block px-4 py-2 text-black text-lg font-medium hover:bg-gray-100"
                @click="closeMobileMenu"
              >
                {{ page.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePagesStore } from '~/stores/pagesStore'
import { getLogoSize } from '~/utils/branding'

const pagesStore = usePagesStore();
const route = useRoute();
const common = computed(() => pagesStore.pages?.common);
const navigationPages = computed(() => pagesStore.navigationPages);

// Define the color prop with a default value of 'bg-white'
const props = defineProps({
  color: {
    type: String,
    default: "bg-white",
  },
  hideNavigation: {
    type: Boolean,
    default: false,
  },
});

// Get current page name from route
const getCurrentPageName = () => {
  const path = route.path;
  if (path === '/') return 'home';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/products')) return 'products';
  if (path.startsWith('/contact')) return 'contact';
  return 'home'; // Default to home if page not found
};

// Get page-specific config from pages.json
const getPageConfig = computed(() => {
  const pageName = getCurrentPageName();
  return pagesStore.getPageConfig(pageName) || pagesStore.getPageConfig('home');
});

const navbarConfig = computed(() => getPageConfig.value?.navbar);
const navbarLogo = computed(() => navbarConfig.value?.logo);
const navbarLogoSrc = computed(() => navbarLogo.value?.src || "/assets/images/brand/logo-primary-1.svg");
const navbarLogoAlt = computed(() => navbarLogo.value?.alt || common.value?.accessibility?.brandLogo || "Brand logo");

// Responsive breakpoint detection
const isMobile = ref(false);
const isTablet = ref(false);

const checkBreakpoints = () => {
  const width = window.innerWidth;
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;
};

// Responsive heights
const navbarHeight = computed(() => {
  const heights = navbarConfig.value?.heights;
  if (!heights) return '83px';
  if (isMobile.value) return heights.mobile || '83px';
  if (isTablet.value) return heights.tablet || '68px';
  return heights.desktop || '68px';
});

const logoHeight = computed(() => getLogoSize('navbar', 'height', isMobile.value, isTablet.value));
const logoWidth = computed(() => getLogoSize('navbar', 'width', isMobile.value, isTablet.value));

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
  if (isMobileMenuOpen.value && !event.target.closest("nav")) {
    closeMobileMenu();
  }
};

// Add click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  checkBreakpoints();
  window.addEventListener("resize", checkBreakpoints);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", checkBreakpoints);
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
