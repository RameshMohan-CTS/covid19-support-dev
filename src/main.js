import Vue from 'vue'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as config from "./config/config";
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(BootstrapVue);

console.info(`Firebase is loading from firebase project ${process.env.VUE_APP_FIREBASE_projectId}`);

firebase.initializeApp(config.firebase_config);
firebase.auth().onAuthStateChanged(user => {
  let currentUser = firebase.auth().currentUser;
  if (currentUser) {
    currentUser.getIdTokenResult().then(idtoken => {
      if (idtoken && idtoken.claims) {
        user.admin = idtoken.claims.admin;
        user.moderator = idtoken.claims.moderator;
        user.verifiedvolunteer = idtoken.claims.verifiedvolunteer;
      }
      store.dispatch("fetchUser", user);
    });
  } else {
    store.dispatch("fetchUser", user);
  }
});

const updateStorewithInitialSettings = (appsettings)=>{
  store.dispatch("updateApplicationSettings",appsettings);
}

const getInitialApplicationSettings = ()=>{
  return new Promise((resolve,reject)=>{
      firebase
          .firestore()
          .collection("application_settings")
          .doc("application_settings")
          .get()
          .then((docRef)=>{
              let appsettings = docRef.data();
              if(appsettings){
                updateStorewithInitialSettings(appsettings);
              } else {
                updateStorewithInitialSettings(config.initial_app_settings);
              }
              resolve(appsettings);
          }).catch((ex)=>{
              updateStorewithInitialSettings(config.initial_app_settings);
              console.log(ex);
              reject();
          })    
  })
};

const start = ()=>{
  getInitialApplicationSettings().then(()=>{
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }).catch(ex=>{
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    console.log(ex);
  });  
}
start();