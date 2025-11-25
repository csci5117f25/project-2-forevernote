<script setup>
import { useFirestore, useCollection, useCurrentUser } from 'vuefire';
import { collection } from 'firebase/firestore';

import NoteCard from '@/components/NoteCard.vue';

const db = useFirestore();
const user = useCurrentUser();

const coll = useCollection(collection(db, 'users', user.value.uid, 'notes'));
</script>

<template>
  <div v-for="doc in coll" :key="doc.id">
    <NoteCard :id="doc.id" :title="doc.title" :tag="doc.tag" :content="doc.notes" />
  </div>
</template>
