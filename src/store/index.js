import Vue from 'vue'
import Vuex from 'vuex'
import * as config from "@/config/config";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app_settings: config.initial_app_settings,
    user: {
      loggedIn: false,
      email : "",
      data: null
    }
  },
  getters: {
    user(state){
      return state.user
    },
    isLoggedInUser(state){
      return state && state.user && state.user.loggedIn
    },
    isAdmin(state){
      return state && state.user && state.user.loggedIn && state.user.data && state.user.data.admin
    },
    app_settings(state){
      return state.app_settings
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
      state.user.email = data && data.email ? data.email : ""
    },
    SET_APPLICATION_CONFIG(state,data){
      state.app_settings = data;
    }
  },
  actions: {
    updateApplicationSettings({commit},data){
      commit("SET_APPLICATION_CONFIG", data);
    },
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          admin: user.admin,
          moderator: user.moderator,
          verifiedvolunteer: user.verifiedvolunteer
        });
      } else {
        commit("SET_USER", null);
      }
    }
  },
  modules: {
  }
})
