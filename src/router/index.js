import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

import SplashView from '@/views/SplashView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ProfileView from '@/views/ProfileView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

// Dev/Testing pages (for now)
import NoteList from '@/views/NoteList.vue';
import NoteView from '@/views/NoteView.vue';
import ExamList from '@/views/ExamList.vue';
import ExamView from '@/views/ExamView.vue';
import EditorView from '@/views/EditorView.vue';

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
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
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
      path: '/notes',
      name: 'note_list',
      component: NoteList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/note/:id',
      name: 'note',
      component: NoteView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exams',
      name: 'exam_list',
      component: ExamList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exam/:id',
      name: 'exam',
      component: ExamView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
});

router.beforeEach(async (to, _, next) => {
  const isLoggedIn = (await getCurrentUser()) ? true : false;

  if (to.meta.requiresAuth) {
    // Navigating to a page that requires authentication
    if (!isLoggedIn) {
      // If not logged in

      next({ name: 'splash' });
    } else {
      next();
    }
  } else if ((to.path === '/' || to.path === '/splash') && isLoggedIn) {
    // Navigating to root when logged in, redirect to notes page

    next({ name: 'dashboard' });
  } else {
    // Navigating to a page that does not require authentication; navigate as normal

    next();
  }
});

export default router;
