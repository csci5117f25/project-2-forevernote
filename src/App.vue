<script setup>
import NavBar from './components/NavBar.vue'
// import SplashWelcome from './components/SplashWelcome.vue';
import SplashView from '@/views/SplashView.vue'
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue'
import LoginModal from './components/LoginModal.vue';

const showLogin = ref(false)

function openLoginModal(){
  console.log("Modal is opened")
  showLogin.value = true
}

function closeLoginModal(){
  showLogin.value = false
}
</script>

<template>
  <header>
    <NavBar @open-login="openLoginModal"/>
  </header>
  <main>
     
    <LoginModal v-if="showLogin" @close="closeLoginModal"/>
  </main>

  <RouterView />
</template>

<style>
</style>
