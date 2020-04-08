const { 
    VUE_APP_FIREBASE_apiKey,
    VUE_APP_FIREBASE_authDomain,
    VUE_APP_FIREBASE_databaseURL,
    VUE_APP_FIREBASE_projectId
} = process.env;

export const superadmins = [ `superadmin@${VUE_APP_FIREBASE_authDomain}` ];

export const initial_app_settings = {
    app_title : "Welcome",
    support_categories: [ "General", "Others"],
    donation_categories: []
};

export const firebase_config = {
    apiKey: VUE_APP_FIREBASE_apiKey,
    authDomain: VUE_APP_FIREBASE_authDomain,
    databaseURL: VUE_APP_FIREBASE_databaseURL,
    projectId: VUE_APP_FIREBASE_projectId,
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};