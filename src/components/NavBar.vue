<script>
import { GoogleAuthProvider } from 'firebase/auth';


const googleAuthProvider = new GoogleAuthProvider();
</script>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUser, useFirebaseAuth, useFirestore } from 'vuefire';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import logoImg from '@/assets/img/logo.png';
import { useTheme } from '@/composables/useTheme';

const router = useRouter();
const auth = useFirebaseAuth();
const user = useCurrentUser();
const db = useFirestore();

const {isDark, toggle} = useTheme();

async function login() {
  await signInWithPopup(auth, googleAuthProvider);

  const userRef = doc(db, 'users', user.value.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    try {
      await setDoc(doc(db, 'users', user.value.uid), {
        themePref: 'auto',
      });
    } catch (e) {
      console.error(e);
    }
  }

  router.push({ name: 'dashboard' });
}

onMounted(() => {
  const navBurger = document.getElementById('nav-burger');
  const navBar = document.getElementById('navbar');

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
          <RouterLink to="/practiceexams" class="navbar-item">✨ Practice</RouterLink>
        </div>

        <div class="navbar-end">
          <div v-if="user" class="buttons">
            <button class="button is-primary is-rounded" @click="toggle">
              {{ isDark ? "☀️": "🌙" }}
            </button>
            <button v-if="!user" class="button is-primary is-rounded" @click="login">Get Started</button>
            <button v-if="user"class="button is-primary is-rounded" @click="router.push({ name: 'profile' })">
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
  background-color: var(--navbar-bg);
  color: var(--text);
}

.navbar-item{
  font-weight: 600;
  color: var(--text);
}

.navbar-end{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
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
