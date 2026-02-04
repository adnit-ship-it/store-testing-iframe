<template>
  <div :class="['w-full max-w-[1280px] px-4 md:px-8', $props.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

defineProps<Props>()
</script> 