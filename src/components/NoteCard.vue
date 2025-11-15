<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
});
</script>

<template>
  <main>
    <h1>{{ props.title }}</h1>
  </main>
</template>

<style scoped>
main {
  width: 500px;
  height: 300px;

  margin: 1rem;
  border: 1px solid white;
  border-radius: 20px;
  padding: 1rem;
}

.preview {
  width: 90%;

  margin: 0 5%;
}
</style>
