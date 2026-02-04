<template>
  <div 
    class="inline-flex items-center justify-center" 
    :style="shouldApplyColor ? { color: iconColor } : {}"
    :class="size"
  >
    <div 
      v-if="svgContent" 
      v-html="svgContent"
      class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
    />
    <img 
      v-else 
      :src="src" 
      :alt="alt" 
      class="w-full h-full"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'w-6 h-6'
  },
  alt: {
    type: String,
    default: 'Icon'
  }
});

const svgContent = ref(null);
const shouldApplyColor = ref(true);

// Fetch and inline the SVG so we can style it
const loadSvg = async () => {
  if (!process.client) return;
  
  try {
    const response = await fetch(props.src);
    if (response.ok) {
      let svg = await response.text();
      
      // Check if SVG uses patterns, embedded images, or gradients
      // These complex SVGs shouldn't have their colors replaced
      const hasPatterns = svg.includes('pattern') || svg.includes('url(#') || svg.includes('xlink:href') || svg.includes('base64');
      
      shouldApplyColor.value = !hasPatterns;
      
      if (!hasPatterns && props.iconColor) {
        // Only apply currentColor to simple path-based SVGs
        // Ensure the SVG uses currentColor for fill and stroke
        // But preserve white strokes (like checkmarks) - these should always stay white
        // Use a more careful approach: replace fills/strokes but preserve white explicitly
        svg = svg.replace(/fill="[^"]*"/g, (match) => {
          if (match.includes('none')) return match;
          // Don't replace if already currentColor
          if (match.includes('currentColor')) return match;
          return 'fill="currentColor"';
        });
        
        // For strokes, be very careful to preserve white
        svg = svg.replace(/(<[^>]*)\s+stroke="([^"]*)"/g, (match, element, strokeValue) => {
          // Always preserve white strokes
          if (strokeValue === 'white' || strokeValue === '#ffffff' || strokeValue === '#FFFFFF' || strokeValue === 'rgb(255,255,255)') {
            return match;
          }
          if (strokeValue === 'none' || strokeValue === 'currentColor') {
            return match;
          }
          // Replace with currentColor
          return element + ' stroke="currentColor"';
        });
      }
      
      svgContent.value = svg;
    }
  } catch (error) {
    console.error('Failed to load SVG:', error);
  }
};

onMounted(() => {
  loadSvg();
});

watch(() => props.src, () => {
  loadSvg();
});
</script>

<style scoped>
/* Additional styling for inline SVG */
:deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* Ensure white strokes stay white */
:deep(svg path[stroke="white"]),
:deep(svg path[stroke="#ffffff"]),
:deep(svg path[stroke="#FFFFFF"]),
:deep(svg path[stroke="rgb(255,255,255)"]) {
  stroke: white !important;
}
</style>

