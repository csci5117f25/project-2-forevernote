import { createRouter, createWebHistory } from 'vue-router';

import SplashView from '@/views/SplashView.vue';
import NotesView from '@/views/NotesView.vue';
import EditorView from '@/views/EditorView.vue';

import { useUserStore } from '@/stores/UserState';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: { name: 'splash' },
      meta: {},
    },
    {
      path: '/splash',
      name: 'splash',
      component: SplashView,
      meta: {},
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, _, next) => {
  const state = useUserStore();

  if (to.meta.requiresAuth) {
    // Auth required
    if (!state.isLoggedIn) {
      // If not logged in
      next({ name: 'splash' });
    } else {
      next();
    }
  } else {
    // Auth not required
    next();
  }
});

export default router;
