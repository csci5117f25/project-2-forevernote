<script setup>
import imgSrc from '../assets/images/Logo.png'

const emit = defineEmits(['open-login'])

function handleLoginClick(){
  console.log("Emit open login from NavBar")
  emit('open-login');
}
</script>

<template>
    <nav class="navbar is-white">
        <div class="navbar-brand">
            <img :src="imgSrc" alt="Logo" id="logo" />
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
            <button class="button is-primary is-rounded" @click="handleLoginClick">Get Started</button>
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