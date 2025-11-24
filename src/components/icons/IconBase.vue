<script setup>
const props = defineProps({
  size: {
    type: String,
  },
  color: {
    type: String,
  },
});
</script>

<template>
  <span class="icon" :style="'width: ' + (props.size || '1rem') + '; height: ' + (props.size || '1rem') + ';'">
    <svg :fill="props.color || 'currentColor'" viewBox="0 0 16 16">
      <slot />
    </svg>
  </span>
</template>
