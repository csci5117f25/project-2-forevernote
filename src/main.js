import './assets/main.css';

import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';

import App from '@/App.vue';
import router from '@/router';
import { firebaseApp } from '@/firebase';

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(router);

app.mount('#app');

const ai = new GoogleGenAI({apiKey: "AIzaSyCYCdk39X3t1z3bJWaRvzI64KyTb-kGQpg"});