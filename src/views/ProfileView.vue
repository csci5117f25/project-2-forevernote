<script setup>
import { useRouter } from 'vue-router';
import { useFirebaseAuth } from 'vuefire';
import { signOut } from 'firebase/auth';

const auth = useFirebaseAuth();
const router = useRouter();

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
  <p class="title has-text-dark">Profile View</p>

  <div class="field is-grouped is-grouped-center">
    <button class="button" @click="logout">Logout</button>
  </div>
</template>
