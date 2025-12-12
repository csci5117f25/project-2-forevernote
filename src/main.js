import './assets/main.css';

import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';
import VueSelect from 'vue-select';

import App from '@/App.vue';
import router from '@/router';
import { firebaseApp } from '@/firebase';

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(router);

app.component('v-select', VueSelect);

app.mount('#app');
