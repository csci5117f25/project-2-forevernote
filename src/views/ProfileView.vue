<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useFirebaseAuth, useCurrentUser, useFirestore, useDocument } from 'vuefire';
import { signOut } from 'firebase/auth';
import { collection, doc } from 'firebase/firestore';

const auth = useFirebaseAuth();
const router = useRouter();

const db = useFirestore();

const user = useCurrentUser();

const notesRef = collection(db, 'users', user.value.uid, 'notes');
const notes = useCollection(notesRef);

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
  <main class="container">
    <p class="title">
      Hey <span id="user-name">{{ user.displayName }}</span>!
    </p>

    <p>You currently have {{ countNotes }} notes!</p>

    <div id="footer" class="buttons has-addons is-centered">
      <button class="button" @click="logout">Logout</button>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

p {
  color: var(--text);
}

#user-name {
  color: var(--h1-color);
}

#footer {
  width: 100%;

  position: absolute;

  bottom: 0;

  margin-bottom: 5rem;
}
</style>
