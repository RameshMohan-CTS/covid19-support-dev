<template>
  <AppHeader fixed>
    <SidebarToggler class="d-lg-none" display="md" mobile />
    <b-link class="navbar-brand" to="/welcome">
      <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoViD-19" />
      <img
        class="navbar-brand-minimized"
        src="img/brand/sygnet.svg"
        width="30"
        height="30"
        alt="CoViD-19"
      />
    </b-link>
    <SidebarToggler class="d-md-down-none" display="lg" :defaultOpen="false" />
    <b-navbar-nav class="d-md-down-none">
      <b-nav-item class="py-2 px-3" to="/need/support">
        <b>Need Support?</b>
      </b-nav-item>
      <b-nav-item class="py-2 px-3" to="/can/support">
        <b>Can Support?</b>
      </b-nav-item>
      <b-nav-item class="py-2 px-3" to="/donate">
        <b>Donate</b>
      </b-nav-item>
      <b-nav-item class="py-2 px-3" to="/track" v-if="!user || !(user && user.loggedIn)">
        <b>Track Request</b>
      </b-nav-item>
      <b-nav-item
        class="py-2 px-3"
        to="/support-requests"
        v-if="user.loggedIn && user.data && (user.data.admin || user.data.moderator || user.data.verifiedvolunteer)"
      >Support Requests</b-nav-item>
      <b-nav-item
        class="py-2 px-3"
        to="/volunteers"
        v-if="user.loggedIn && user.data && (user.data.admin || user.data.moderator)"
      >Volunteers</b-nav-item>
      <b-nav-item
        class="py-2 px-3"
        to="/donations"
        v-if="user.loggedIn && user.data && (user.data.admin || user.data.moderator)"
      >Donations</b-nav-item>
      <!-- <b-nav-item
        class="py-2 px-3"
        to="/groups"
        v-if="user.loggedIn && user.data && (user.data.admin || user.data.moderator || user.data.verifiedvolunteer)"
      >Groups</b-nav-item> -->
      <!-- <b-nav-item class="py-2 px-3" to="/about">About</b-nav-item>-->
      <b-nav-item class="py-2 px-3" to="/contact">Contact</b-nav-item> 
      <b-nav-item class="py-2 px-3" to="/contact/moderator" title="Contact Moderator"><i class="fa fa-envelope"></i></b-nav-item> 
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto" style="margin-right:20px;">
      <template v-if="user.loggedIn">
        <b-nav-item class="d-md-down-none" v-if="user">
          <b-nav-item class="py-2 px-3">
            <router-link to="/profile">
              <b>My Dashboard</b>
            </router-link>
          </b-nav-item>
        </b-nav-item>
        <b-nav-item class="d-md-down-none" v-if="user.loggedIn && user.data && (user.data.admin || user.data.moderator || user.data.verifiedvolunteer || isSuperAdmin)">
          <b-nav-item class="py-2 px-3">
            <router-link to="/admin">Manage</router-link>
          </b-nav-item>
        </b-nav-item>
        <b-nav-item class="d-md-down-none" v-if="user">
          <b-nav-item class="py-2 px-3" @click.prevent="signOut">Signout</b-nav-item>
        </b-nav-item>
      </template>
      <template v-else>
        <b-nav-item class="d-md-down-none">
          <b-nav-item class="py-2 px-3" to="/login">Login / Register</b-nav-item>
        </b-nav-item>
      </template>
    </b-navbar-nav>
  </AppHeader>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import { superadmins } from "@/config/config";
import { Header as AppHeader, SidebarToggler, AsideToggler } from "@coreui/vue";
export default {
  name: "DefaultHeader",
  components: {
    AsideToggler,
    AppHeader,
    SidebarToggler
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    isSuperAdmin(){
      return this.user && this.user.data ? superadmins.indexOf(this.user.data.email) > -1 : false;
    },
    signOut() {
      this.$router.replace({
        name: "signout"
      });
    }
  }
};
</script>