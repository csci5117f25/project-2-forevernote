<script setup>
import imgSrc from '../assets/images/Logo.png'
</script>

<template>
    <nav class="navbar is-white">
        <div class="navbar-brand">
            <img :src="imgSrc" alt="Logo" id="logo" />
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
            <button class="button is-primary is-rounded">Get Started</button>
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

.navbar{
    border-bottom: 1pt solid gray;
}
</style>