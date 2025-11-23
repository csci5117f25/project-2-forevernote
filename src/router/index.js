import { createRouter, createWebHistory } from 'vue-router';

import SplashView from '@/views/SplashView.vue';
import NotesView from '@/views/NotesView.vue';
import EditorView from '@/views/EditorView.vue';

import { useUserStore } from '@/stores/UserState';
import DashboardView from '@/views/DashboardView.vue';
import AllNotesView from '@/views/AllNotesView.vue';

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
    {
      path: '/dashboard', 
      name: 'dashboard', 
      component: DashboardView
    },
    {
      path: '/allNotes', 
      name: 'allNotes', 
      component: AllNotesView
    }
  ],
});

router.beforeEach((to, _, next) => {
  const state = useUserStore();

  if (to.meta.requiresAuth) {
    // Navigating to a page that requires authentication

    if (!state.isLoggedIn) {
      // If not logged in
      next({ name: 'splash' });
    } else {
      next();
    }
  } else if ((to.path === '/' || to.path === '/splash') && state.isLoggedIn) {
    // Navigating to root when logged in, redirect to notes page

    next({ name: 'notes' });
  } else {
    // Navigating to a page that does not require authentication; navigate as normal

    next();
  }
});

export default router;
