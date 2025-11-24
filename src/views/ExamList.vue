<script setup>
import { useFirestore, useCollection, useCurrentUser } from 'vuefire';
import { collection } from 'firebase/firestore';

import ExamCard from '@/components/ExamCard.vue';

const db = useFirestore();
const user = useCurrentUser();

const coll = useCollection(collection(db, 'users', user.value.uid, 'exams'));
</script>

<template>
  <div v-for="doc in coll" :key="doc.id">
    <RouterLink :to="'/exam/' + doc.id">
      <ExamCard
        :id="doc.id"
        :subject="doc.subject"
        :examDate="doc.examDate"
        :location="doc.location"
        :topics="doc.topics"
      />
    </RouterLink>
  </div>
</template>
