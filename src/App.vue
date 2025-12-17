<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <header>
    <NavBar />
  </header>

  <body>
    <RouterView />
  </body>
</template>

<style scoped>
header {
  width: 100vw;
  height: 15vh;
}

body {
  width: 100vw;
  height: 85vh;
}
</style>
