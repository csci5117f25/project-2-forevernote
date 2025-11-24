<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <header>
    <NavBar />
  </header>

  <body class="container">
    <RouterView />
  </body>
</template>

<style>
#app {
  background-color: white;
}
</style>
