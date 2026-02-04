<template>
  <div class="min-h-screen bg-white flex flex-col">
    <LayoutNavbar color="bg-accentColor1" />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
// Products layout components are auto-imported in Nuxt 3
</script>
