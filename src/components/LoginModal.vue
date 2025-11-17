<script setup>
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="emit('close')">✕</button>
      <form class="modal-form">
        <label>Username:</label>
        <input class="input is-primary" type="email" placeholder="Email" />

        <label>Password:</label>
        <input class="input is-primary" type="password" placeholder="Password" />

        <button class="button is-primary is-fullwidth mt-3">Login</button>
        <span class="modal-span">New Here? 
            <a>Sign up Now</a>
        </span>
      </form>
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}


.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* === Close button inside modal === */
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #555;
}

.close-btn:hover {
  color: #000;
}
</style>