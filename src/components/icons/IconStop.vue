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
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z"
    />
  </IconBase>
</template>
