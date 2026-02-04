<template>
    <div class="w-full flex justify-center">
        <div class="w-full flex flex-col py-20 pt-0 md:py-24 px-6 lg:px-0 max-w-[1056px]">
            <div class="flex items-center justify-start gap-1 lg:gap-3 max-w-[1050px]">
                <div class="h-[10px] w-[10px] md:w-4 md:h-4 lg:h-6 lg:w-6 rounded-full bg-accentColor1"></div>
                <div :class="['h-[1px] w-16 md:w-[145px]', progressLineColorClass]"></div>
                <div :class="['h-[10px] w-[10px] md:w-4 md:h-4 lg:h-6 lg:w-6 rounded-full border-2', progressDotBorderClass]"></div>
                <div :class="['h-[1px] w-16 md:w-[145px]', progressLineColorClass]"></div>
                <div :class="['h-[10px] w-[10px] md:w-4 md:h-4 lg:h-6 lg:w-6 rounded-full border-2', progressDotBorderClass]"></div>
                <div :class="['h-[1px] w-16 md:w-[145px]', progressLineColorClass]"></div>
                <div :class="['h-[10px] w-[10px] md:w-4 md:h-4 lg:h-6 lg:w-6 rounded-full border-2', progressDotBorderClass]"></div>
                <div :class="['h-[1px] w-16 md:w-[145px]', progressLineColorClass]"></div>
                <div :class="['h-[10px] w-[10px] md:w-4 md:h-4 lg:h-6 lg:w-6 rounded-full border-2', progressDotBorderClass]"></div>
            </div>
            <div class="mt-10">
                <h3 class="text-[20px] md:text-[32px] font-semibold">
                    Reach your goal weight
                    <span class="text-accentColor1">fast <br />and easy with Serenova</span>
                </h3>
            </div>
            <div class="mt-6 md:pt-p flex flex-col gap-2">
                <div class="flex flex-col gap-2 max-w-[1050px] text-[14px] md:text-[20px] font-inter">
                    <p>Name</p>
                    <input placeholder="First and Last" type="text"
                        :class="['p-2 h-[36px] md:h-[48px] rounded', inputBorderClass]" />
                </div>
            </div>
            <div class="mt-6 md:pt-p flex flex-col gap-2">
                <div class="flex flex-col gap-2 max-w-[1050px] text-[14px] md:text-[20px] font-inter">
                    <p>Age</p>
                    <input placeholder="In Years" type="text"
                        :class="['p-2 h-[36px] md:h-[48px] rounded', inputBorderClass]" />
                </div>
            </div>
            <div class="mt-6 md:pt-p flex flex-col gap-2">
                <div class="flex flex-col gap-2 max-w-[1050px] text-[14px] md:text-[20px] font-inter">
                    <p>Height</p>
                    <input placeholder="5'10" type="text"
                        :class="['p-2 h-[36px] md:h-[48px] rounded', inputBorderClass]" />
                </div>
            </div>
            <div class="mt-6 md:pt-p flex flex-col gap-2">
                <div class="flex flex-col gap-2 max-w-[1050px] text-[14px] md:text-[20px] font-inter">
                    <p>Weight</p>
                    <input placeholder="In Pounds" type="text"
                        :class="['p-2 h-[36px] md:h-[48px] rounded', inputBorderClass]" />
                </div>
            </div>
            <NuxtLink class="mt-6 md:pt-4" to="/consultation">
                <UiButton :width="buttonWidth" :height="buttonHeight" :font-size="buttonFontSize">
                    <div class="w-[56px] h-[18px] md:w-[85px] md:h-[30px]">
                        <svg class="h-full w-full" viewBox="0 0 38 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.842 0.0564635V8.37231H5.68883L1.46187 2.27348H1.38472V8.37231H0.130037V0.0564635H1.29133L5.52235 6.16342H5.5995V0.0564635H6.842ZM11.2628 8.49819C10.6484 8.49819 10.1191 8.3669 9.6752 8.10432C9.23396 7.83904 8.89288 7.46683 8.65196 6.98769C8.41374 6.50585 8.29464 5.94144 8.29464 5.29447C8.29464 4.65563 8.41374 4.09257 8.65196 3.60532C8.89288 3.11806 9.22854 2.73773 9.65895 2.46432C10.0921 2.19092 10.5983 2.05422 11.1776 2.05422C11.5295 2.05422 11.8706 2.11242 12.2008 2.22882C12.5311 2.34522 12.8275 2.52794 13.0901 2.77698C13.3526 3.02602 13.5597 3.34951 13.7113 3.74743C13.8629 4.14265 13.9387 4.62314 13.9387 5.1889V5.61931H8.98086V4.70977H12.749C12.749 4.39034 12.684 4.10746 12.5541 3.86113C12.4241 3.61209 12.2414 3.41583 12.0059 3.27236C11.7731 3.12889 11.4997 3.05715 11.1857 3.05715C10.8446 3.05715 10.5468 3.14107 10.2924 3.3089C10.0406 3.47403 9.84574 3.69059 9.70768 3.95858C9.57233 4.22386 9.50466 4.51216 9.50466 4.82346V5.53404C9.50466 5.95092 9.57775 6.30553 9.72392 6.59789C9.87281 6.89024 10.0799 7.11357 10.3452 7.26787C10.6105 7.41946 10.9204 7.49525 11.275 7.49525C11.5051 7.49525 11.7149 7.46277 11.9044 7.3978C12.0939 7.33013 12.2577 7.22997 12.3957 7.09733C12.5338 6.96468 12.6393 6.80091 12.7124 6.60601L13.8615 6.81309C13.7695 7.15147 13.6044 7.44788 13.3662 7.70234C13.1307 7.95409 12.8342 8.15034 12.4769 8.2911C12.1223 8.42916 11.7176 8.49819 11.2628 8.49819ZM16.0989 2.13543L17.4754 4.56359L18.864 2.13543H20.1918L18.2469 5.25387L20.2081 8.37231H18.8803L17.4754 6.0416L16.0745 8.37231H14.7427L16.6836 5.25387L14.767 2.13543H16.0989ZM24.3497 2.13543V3.10994H20.943V2.13543H24.3497ZM21.8566 0.641172H23.0707V6.54104C23.0707 6.77655 23.1059 6.95386 23.1763 7.07296C23.2467 7.18936 23.3373 7.26922 23.4483 7.31253C23.562 7.35314 23.6852 7.37344 23.8178 7.37344C23.9153 7.37344 24.0005 7.36667 24.0736 7.35314C24.1467 7.3396 24.2036 7.32877 24.2442 7.32065L24.4634 8.32359C24.3931 8.35066 24.2929 8.37773 24.163 8.4048C24.033 8.43458 23.8706 8.45082 23.6757 8.45352C23.3563 8.45894 23.0585 8.40209 22.7824 8.28298C22.5063 8.16388 22.283 7.9798 22.1124 7.73076C21.9419 7.48172 21.8566 7.16906 21.8566 6.79279V0.641172ZM33.9 8.52255L33.1691 7.79979L35.7069 5.26199H29.332V4.20627H35.7069L33.1691 1.67253L33.9 0.945707L37.6884 4.73413L33.9 8.52255Z"
                                fill="white" />
                        </svg>
                    </div>
                </UiButton>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { resolveColorToken } from '~/utils/colorTokens';

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Mobile detection
const isMobile = ref(false);

// Check mobile on mount and resize
const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
});

// Derived button sizes
const buttonWidth = computed(() => (isMobile.value ? "144px" : "170px"));
const buttonHeight = computed(() => (isMobile.value ? "28px" : "44px"));
const buttonFontSize = computed(() => (isMobile.value ? "16" : "24"));

// Map hardcoded colors to base colors
// bg-[#dddddd] -> bodyColor (light gray)
// border-[#E6CFB6] -> accentColor2 (light beige/pink, closest to accentColor2)
// border-[#AAA8A8] -> bodyColor (gray border)
const progressLineColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'bg')
})

const progressDotBorderClass = computed(() => {
  // border-[#E6CFB6] is a light beige, closest to accentColor2
  return resolveColorToken('accentColor2', 'border')
})

const inputBorderClass = computed(() => {
  // border-[#AAA8A8] is a gray, closest to bodyColor
  return resolveColorToken('bodyColor', 'border') + ' border'
})
</script>