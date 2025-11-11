<script setup>
// import { watch } from 'vue';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection } from 'vuefire';

import NoteCard from '@/components/NoteCard.vue';

const db = useFirestore();
const coll = useCollection(collection(db, "notes"));

// watch(coll, () => { });
</script>

<template>
  <main>
    <h1>This is the notes page</h1>

    <li v-for="doc in coll" :key="doc.id">
      <NoteCard :title="doc.title" />
    </li>
  </main>
</template>
