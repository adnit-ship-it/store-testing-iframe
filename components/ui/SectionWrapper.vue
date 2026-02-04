<template>
  <section :class="['w-full flex justify-center items-center', $props.class]">
    <slot />
  </section>
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

defineProps<Props>()
</script> 