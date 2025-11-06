<script setup>
import NavBar from './components/NavBar.vue'
import SplashWelcome from './components/SplashWelcome.vue';
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>

  <header>
    <NavBar/>
    <nav>
      <RouterLink to="/notes">Notes</RouterLink>
    </nav>
  </header>
  <body>
    <SplashWelcome/>
  </body>

</template>
<style>
#app{
  background-color: white;
}
</style>
