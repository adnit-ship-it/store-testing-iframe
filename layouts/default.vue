<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LayoutNavbar color="bg-accentColor1" :hideNavigation="isCheckoutOrConsultationPage" />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
// Layout components are auto-imported in Nuxt 3
const route = useRoute();

const isCheckoutOrConsultationPage = computed(() => {
  return route.path === "/checkout" || route.path === "/consultation" || route.path === "/welcome" || route.path === "/consultation";
});
</script>
