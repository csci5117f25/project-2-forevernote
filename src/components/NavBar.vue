<script setup>

const emit = defineEmits(['open-login'])

function handleLoginClick(){
  console.log("Emit open login from NavBar")
  emit('open-login');
}
import { useUserStore } from '@/stores/UserState';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

import imgSrc from '../assets/images/Logo.png';
import { onMounted } from 'vue';

const state = useUserStore();
const router = useRouter();

function login() {
  state.isLoggedIn = true;

  router.push({ name: 'notes' });
}

function goToRoot() {
  router.push({ name: 'root' });
}

onMounted(() => {
  const el = document.getElementById("nav-burger");

  el.addEventListener('click', () => {
    const target = el.dataset.target;
    const $target = document.getElementById(target);

    el.classList.toggle('is-active');
    $target.classList.toggle('is-active')
  })
});
</script>

<template>
  <nav class="navbar is-white">
    <div class="navbar-brand">
      <a class="navbar-item" @click="goToRoot">
        <img :src="imgSrc" alt="Logo" id="logo" />
      </a>

      <a id="nav-burger" role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
        data-target="navbar" @click="onMenuClick">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/notes" class="navbar-item">Notes</RouterLink>
        <RouterLink to="/editor" class="navbar-item">Editor</RouterLink>
      </div>

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

@media (max-width: 768px) {
  #logo {
    max-height: 2rem;
  }

  .button.is-rounded {
    font-size: 0.8rem;
    padding: 0.4rem 0.9rem;
  }

  #main-navbar {
    padding: 0.4rem 0.8rem;
  }
}
</style>
