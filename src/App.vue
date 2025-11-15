<script setup>
import NavBar from './components/NavBar.vue';
</script>

<template>
  <header>
    <NavBar />
  </header>

  <RouterView />
</template>

<style>
#app {
  background-color: white;
}
</style>
