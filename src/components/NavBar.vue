<script>
import { GoogleAuthProvider } from 'firebase/auth';

const googleAuthProvider = new GoogleAuthProvider();
</script>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUser, useFirebaseAuth, useFirestore, useDocument } from 'vuefire';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import logoImg from '@/assets/img/logo.png';

const router = useRouter();
const auth = useFirebaseAuth();
const user = useCurrentUser();
const db = useFirestore();

async function login() {
  await signInWithPopup(auth, googleAuthProvider);

  const userRef = doc(db, 'users', user.value.uid);
  const userDoc = useDocument(userRef);

  if (!userDoc.value) {
    try {
      await setDoc(doc(db, 'users', user.value.uid), {
        themePref: 'auto',
      });
    } catch (e) {
      console.error(e);
    }
  }

  router.push({ name: 'root' });
}

onMounted(() => {
  const navBurger = document.getElementById('nav-burger');
  const navBar = document.getElementById('nav-bar');

  navBurger?.addEventListener('click', () => {
    navBurger.classList.toggle('is-active');
    navBar?.classList.toggle('is-active');
  });
});
</script>

<template>
  <main>
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <RouterLink class="navbar-item" to="/">
          <img :src="logoImg" alt="Logo" id="logo" />
        </RouterLink>

        <div id="nav-burger" class="navbar-burger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbar" class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/dashboard" class="navbar-item">Home</RouterLink>
          <RouterLink to="/notes" class="navbar-item">Notes</RouterLink>
          <RouterLink to="/exams" class="navbar-item">Exams</RouterLink>
        </div>

        <div class="navbar-end">
          <div v-if="!user" class="buttons">
            <button class="button is-primary is-rounded" @click="login">Get Started</button>
          </div>
          <div v-else class="buttons">
            <button class="button is-primary is-rounded" @click="router.push({ name: 'profile' })">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  </main>
</template>

<style scoped>
main {
  margin-bottom: 1rem;
}

nav {
  padding-right: 0.5rem;
}

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
