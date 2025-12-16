<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useFirebaseAuth, useCurrentUser, useFirestore } from 'vuefire';
import { signOut } from 'firebase/auth';
import { collection } from 'firebase/firestore';

const auth = useFirebaseAuth();
const router = useRouter();

const db = useFirestore();

const user = useCurrentUser();

const notesRef = collection(db, 'users', user.value?.uid || 'no-user', 'notes');
const notes = useCollection(notesRef);

watch(
  notes,
  (newNotes) => {
    if (!newNotes) return;
    newNotes.forEach((n) => {
      if (n && n.isSelected === undefined) { n.isSelected = false; };
    });
  },
  { immediate: true, deep: true }
);

const countNotes = computed(() => {
  return notes.value ? notes.value.length : 0;
});


async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('error signing out:', e);
  }

  router.push({ name: 'splash' });
}
</script>

<template>
  <p class="title has-text-dark">Hey {{ user.displayName }}!</p>
  <p class="has-text-dark">notes created: {{ countNotes }}</p>

  <div class="field is-grouped is-grouped-center">
    <button class="button" @click="logout">Logout</button>
  </div>
</template>
