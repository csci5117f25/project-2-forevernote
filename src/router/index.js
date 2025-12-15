import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

import SplashView from '@/views/SplashView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ProfileView from '@/views/ProfileView.vue';

import NoteList from '@/views/NoteList.vue';
import NoteView from '@/views/NoteView.vue';

import ExamGenerator from '@/components/ExamGenerator.vue';

import NotFoundView from '@/views/NotFoundView.vue';

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
      path: '/notes',
      name: 'note_list',
      component: NoteList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/note/new',
      name: 'new_note',
      component: NoteView,
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
      path: '/practiceexams',
      name: 'practiceexams',
      component: ExamGenerator,
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
    if (!isLoggedIn) {
      next({ name: 'splash' });
    } else {
      next();
    }
  } else if (isLoggedIn && (to.path === '/' || to.path === '/splash')) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
