<script setup>
import { useUserStore } from '@/stores/UserState';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

import imgSrc from '../assets/images/Logo.png';

const state = useUserStore();
const router = useRouter();

function login() {
  state.isLoggedIn = true;

  router.push({ name: 'notes' });
}
</script>

<template>
  <nav class="navbar is-white">
    <div class="navbar-brand">
      <img :src="imgSrc" alt="Logo" id="logo" />
    </div>

    <div class="navbar-menu">
      <RouterLink to="/notes" class="navbar-item">Notes</RouterLink>
      <RouterLink to="/editor" class="navbar-item">Editor</RouterLink>

      <div class="navbar-end">
        <div class="navbar-item">
          <button class="button is-primary is-rounded" @click="login">Get Started</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
#logo {
  max-height: 3.5rem;
  width: auto;
  height: auto;
  object-fit: contain;
}

.navbar {
  border-bottom: 1pt solid gray;
}
</style>
