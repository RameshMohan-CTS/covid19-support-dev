<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-sm-12">
        <b-modal title="Error" v-model="error" @ok="error = false" ok-only ok-variant="primary">
          <div class="alert alert-danger">{{errormsg}}</div>
        </b-modal>
        <b-modal title="Success" v-model="success" @ok="success=false" ok-only ok-variant="primary">
          <div class="alert alert-success">{{successmsg}}</div>
        </b-modal>
      </div>
      <div class="col-sm-12" v-if="user && user.loggedIn && user.data && (user.data.admin || user.data.moderator || isSuperAdmin)">
        <div class="card">
          <div class="card-body">
            <router-link to="/admin/appsettings" v-if="user.data.admin">
              <button class="btn btn-primary mr-4">Click for Application Settings</button>
            </router-link>
            <router-link to="/admin/messages" v-if="user.data.admin || user.data.moderator">
              <button class="btn btn-primary mr-4">Messages</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-sm-12" v-if="user && user.loggedIn && user.data && (user.data.admin || isSuperAdmin)">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-12">
                <h5 class="text-primary">Add New admin</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <fieldset role="group" class="b-form-group form-group">
                  <div role="group" class>
                    <input
                      id="newadminemail"
                      type="text"
                      placeholder="New admin email"
                      class="form-control"
                      v-model="newadminemail"
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-8">
                <div>
                  <p>By submitting, I am agreeing the T&C and sharing all the above information with the support team.</p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="text-right mr-4">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addAdmin"
                    v-if="!submitting_admin"
                  >Add admin</button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    v-if="submitting_admin"
                  >Submitting...</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12" v-if="user && user.loggedIn && user.data && (user.data.admin || user.data.moderator)">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-12">
                <h5 class="text-primary">Add New Moderator</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <fieldset role="group" class="b-form-group form-group">
                  <div role="group" class>
                    <input
                      id="newmoderatoremail"
                      type="text"
                      placeholder="New moderator email"
                      class="form-control"
                      v-model="newmoderatoremail"
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-8">
                <div>
                  <p>By submitting, I am agreeing the T&C and sharing all the above information with the support team.</p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="text-right mr-4">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addModerator"
                    v-if="!submitting_moderator"
                  >Add Moderator</button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    v-if="submitting_moderator"
                  >Submitting</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12" v-if="user && user.loggedIn && user.data && (user.data.admin || user.data.moderator || user.data.verifiedvolunteer)">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-12">
                <h5 class="text-primary">Verify volunteer</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <fieldset role="group" class="b-form-group form-group">
                  <div role="group" class>
                    <input
                      id="newvolunteeremail"
                      type="text"
                      placeholder="Volunteer email"
                      class="form-control"
                      v-model="newvolunteeremail"
                    />
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-8">
                <div>
                  <p>By submitting, I am agreeing the T&C and sharing all the above information with the support team.</p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="text-right mr-4">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="verifyVolunteer"
                    v-if="!submitting_verifyvolunteer"
                  >Verify Volunteer</button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    v-if="submitting_verifyvolunteer"
                  >Submitting..</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { updateUserRoles } from "@/app/backend.js";
import { superadmins } from "@/config/config";
export default {
  data() {
    return {
      submitting_admin: false,
      submitting_moderator: false,
      submitting_verifyvolunteer: false,
      error: null,
      errormsg: '',
      success: null,
      successmsg: '',
      newadminemail: "",
      newmoderatoremail: "",
      newvolunteeremail: ""
    };
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
    showErrorMessage(errormsg){
      this.error = true;
      this.errormsg = errormsg;
      this.success = false;
      this.successmsg = null;
    },
    showSuccessMessage(successmsg){
      this.error = false;
      this.errormsg = null;
      this.success = true;
      this.successmsg = successmsg;
    },
    async addAdmin() {
      if(!this.newadminemail || this.newadminemail.indexOf("@") < 0 ||  this.newadminemail.indexOf(".") < 0){
        this.showErrorMessage("Enter valid email address..");
      } else {
      this.submitting_admin = true;
        updateUserRoles(this.newadminemail,'admin')
        .then(msg => {
          this.submitting_admin = false;
          if (
            msg &&
            msg.data &&
            msg.data.data &&
            msg.data.data.indexOf("Added user") > -1 &&
            msg.data.data.indexOf("as admin") > -1
          ) {
            this.showSuccessMessage(msg.data.data);
          } else {
            this.errormsg = msg && msg.data && msg.data.data ? msg.data.data : (msg && msg.data && msg.data.errorInfo && msg.data.errorInfo.message ? msg.data.errorInfo.message :   "Failed to update.")
            this.showErrorMessage(this.errormsg);
          }
          this.newadminemail = "";
        })
        .catch(() => {
          this.submitting_admin = false;
          this.newadminemail = "";
        });
      }
    },
    async addModerator() {
      this.submitting_moderator = true;
      updateUserRoles(this.newmoderatoremail,'moderator')
        .then(msg => {
          this.submitting_moderator = false;
          if (
            msg &&
            msg.data &&
            msg.data.data &&
            msg.data.data.indexOf("Added user") > -1 &&
            msg.data.data.indexOf("as moderator") > -1
          ) {
            this.showSuccessMessage(msg.data.data);
          } else {
            this.errormsg = msg && msg.data && msg.data.data ? msg.data.data : (msg && msg.data && msg.data.errorInfo && msg.data.errorInfo.message ? msg.data.errorInfo.message :   "Failed to update.")
            this.showErrorMessage(this.errormsg);
          }
          this.newmoderatoremail = "";
        })
        .catch(() => {
          this.submitting_moderator = false;
          this.newmoderatoremail = "";
        });
    },
    async verifyVolunteer() {
      this.submitting_verifyvolunteer = true;
      updateUserRoles(this.newvolunteeremail,'verifiedvolunteer')
        .then(msg => {
          this.submitting_verifyvolunteer = false;
          if (
            msg &&
            msg.data &&
            msg.data.data &&
            msg.data.data.indexOf("Volunteer") > -1 &&
            msg.data.data.indexOf("marked as verified") > -1
          ) {
            this.showSuccessMessage(msg.data.data);
          } else {
            this.errormsg = msg && msg.data && msg.data.data ? msg.data.data : (msg && msg.data && msg.data.errorInfo && msg.data.errorInfo.message ? msg.data.errorInfo.message :   "Failed to update.")
            this.showErrorMessage(this.errormsg);
          }
          this.newvolunteeremail = "";
        })
        .catch(() => {
          this.submitting_verifyvolunteer = false;
          this.newvolunteeremail = "";
        });
    }
  }
};
</script>