<script setup>
import { useUserStore } from '@/stores/UserState';

const state = useUserStore();
</script>

<template>
  <main>
    <h1>This is splash page</h1>

    <p>
      You are currently:
      <span v-if="state.isLoggedIn">Logged In</span>
      <span v-else>Not Logged In</span>!
    </p>

    <button @click="state.isLoggedIn = !state.isLoggedIn">Login</button>
  </main>
</template>
