<template>
  <div :class="[
    'h-[88px] relative md:h-[128px] w-[276px] md:w-[500px] transition-all duration-300 lg:h-[176px] lg:w-[352px] flex flex-row lg:flex-col items-start lg:items-center justify-start lg:justify-center gap-5 px-5 py-2 md:py-4 lg:px-0 lg:py-0',
    isActive ? 'bg-accentColor2/50' : 'bg-accentColor2/20 lg:bg-accentColor2/50'
  ]">
    <UiIcon 
      :src="img" 
      :icon-color="iconColor"
      size="h-7 w-7 md:w-[44px] md:h-[44px]"
      class="lg:mt-0 absolute top-2 left-2 md:left-4"
      :alt="title"
    />
    <div class="flex justify-center flex-col gap-0.5 lg:gap-2 pl-8 md:pl-16 lg:pl-0">
      <p class="text-[16px] md:text-[20px] font-semibold text-left lg:text-center">
        {{ title }}
      </p>
      <p class="text-black text-[14px] md:text-[20px] font-medium text-left lg:text-center">
        <span v-html="subtext"></span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  img: string
  title: string
  subtext: string
  isActive?: boolean
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>