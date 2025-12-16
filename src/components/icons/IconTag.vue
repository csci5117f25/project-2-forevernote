<script setup lang="ts">
import IconBase from './IconBase.vue';

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
  <IconBase :color="props.color" :size="props.size">
    <path
      d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
    />
  </IconBase>
</template>
