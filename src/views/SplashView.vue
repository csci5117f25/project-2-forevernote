<script setup>
import { useRouter } from 'vue-router';
import { getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { onMounted } from 'vue';
import { useFirebaseAuth } from 'vuefire';

import { useUserStore } from '@/stores/UserState';

const auth = useFirebaseAuth();

const state = useUserStore();
const router = useRouter();
</script>

<template>
  <main>
    <h1>This is splash page</h1>

    <p>
      You are currently:
      <span v-if="state.isLoggedIn">Logged In</span>
      <span v-else>Not Logged In</span>!
    </p>

    <button @click="router.push({ name: "login" })">Login</button>
  </main>
</template>
