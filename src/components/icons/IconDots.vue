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
      d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
    />
  </IconBase>
</template>
