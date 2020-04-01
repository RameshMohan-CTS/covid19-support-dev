import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import * as firebase from "firebase";
import * as config from "./config/config";
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

firebase.initializeApp(config.firebase_config);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
