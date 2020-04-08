<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
    </div>
    <div class="container mt-4">      
      <div class="row">
        <div class="col-sm-12">
          <div class="jumbotran border p-4 mb-4 bg-warning text-dark text-center">
            <h1 v-if="app_settings && app_settings.app_title">{{app_settings.app_title}}</h1>
            <h1 v-else>Let's make a difference</h1>
          </div>
        </div>
      </div>
      <div class="d-xs-block d-sm-block d-md-block d-lg-none">
        <div class="row" v-if="user && user.loggedIn">
          <div class="col-sm-6">
            <div class="card bg-primary text-center p-1">
              <div class="card-body">
                <router-link class="text-white" to="profile">
                  <h4>Profile</h4>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card bg-primary text-center p-1">
              <div class="card-body">
                <router-link class="text-white" to="signout">
                  <h4>signout</h4>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-else>
          <div class="col-sm-12">
            <div class="card bg-primary text-center p-4">
              <div class="card-body">
                <router-link class="text-white" to="login">
                  <h4>Login / Register</h4>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body bg-primary text-center p-4">
              <router-link to="/need/support" class="text-white">
                <h4>
                  <i class="fa fa-life-ring fa-lg my-2"></i>
                </h4>
                <h4>Need Help?</h4>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body bg-primary text-center p-4">
              <router-link to="/can/support" class="text-white">
                <h4>
                  <i class="fa fa-heart fa-lg my-2"></i>
                </h4>
                <h4>Can Help?</h4>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body bg-primary text-center p-4">
              <router-link to="/donate" class="text-white">
                <h4>
                  <i class="fa fa-gift fa-lg my-2"></i>
                </h4>
                <h4>Donate</h4>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data(){
    return {      
      breadcrumbs : [
        { text : "Home", active: true }
      ],
    }
  },
  computed: {
    ...mapGetters({
      user: "user",
      app_settings: "app_settings"
    })
  }
};
</script>