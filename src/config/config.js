const { 
    VUE_APP_FIREBASE_apiKey,
    VUE_APP_FIREBASE_authDomain,
    VUE_APP_FIREBASE_databaseURL,
    VUE_APP_FIREBASE_projectId
} = process.env;

export const superadmins = [ 'yesoreyeram@gmail.com' , 'masteruser@covid19-support-dev.web.app', 'superadmin@covid19-support-dev.web.app' ];

export const firebase_config = {
    apiKey: VUE_APP_FIREBASE_apiKey,
    authDomain: VUE_APP_FIREBASE_authDomain,
    databaseURL: VUE_APP_FIREBASE_databaseURL,
    projectId: VUE_APP_FIREBASE_projectId,
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};