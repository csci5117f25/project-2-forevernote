<script setup>
import IconEnter from './icons/IconEnter.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  content: {
    type: String,
  },
});
</script>

<template>
  <main>
    <div>
      <p class="is-size-6 has-text-dark">{{ props.title }}</p>

      <p v-if="props.tag" class="tag">{{ props.tag }}</p>
    </div>

    <textarea class="textarea preview has-text-black" :value="props.content"></textarea>

    <RouterLink :to="'/note/' + props.id">
      <IconEnter />
    </RouterLink>
  </main>
</template>

<style scoped>
main {
  width: 500px;
  height: 300px;

  margin: 1rem;
  border: 1px solid black;
  border-radius: 20px;
  padding: 1rem;
}

.preview {
  background-color: white;
}
</style>
