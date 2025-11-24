<script setup>
import { Timestamp } from 'firebase/firestore';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  examDate: {
    type: Timestamp,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  topics: {
    type: Array,
  },
});
</script>

<template>
  <main>
    <div>
      <p class="is-size-6 has-text-dark">{{ props.subject }}</p>

      <p v-if="props.examDate" class="is-size-7 has-text-dark">
        🗓️ {{ props.examDate.toDate().toLocaleDateString() }}
      </p>
      <p v-if="props.examDate" class="is-size-7 has-text-dark">
        🕐 {{ props.examDate.toDate().toLocaleTimeString() }}
      </p>

      <p class="is-size-7 has-text-dark">📍 {{ props.location }}</p>

      <p v-for="topic in props.topics" :key="topic" class="is-size-7 has-text-dark">
        💡 {{ topic }}
      </p>
    </div>
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
  width: 90%;

  margin: 0 5%;
}
</style>
