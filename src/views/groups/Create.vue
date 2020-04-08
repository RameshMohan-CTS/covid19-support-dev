<template>
  <div class="container py-4" v-if="user && user.loggedIn && user.data && (user.data.admin || user.data.moderator)">
    <div class="row" v-if="error">
      <div class="col-sm-12">
        <div class="alert alert-danger">{{error}}</div>
      </div>
    </div>
    <div class="row" v-if="successmessage">
      <div class="col-sm-12">
        <div class="alert alert-success">{{successmessage}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">Create Group</div>
          <div class="card-body">
            <div class="form-group row">
              <div class="col-sm-12">
                <input
                  id="groupname"
                  type="text"
                  class="form-control"
                  name="groupname"
                  value
                  required
                  autofocus
                  v-model="form.groupname"
                  placeholder="Group Name"
                        /> 
              </div>
              <div class="col-sm-12 my-3">
                <textarea
                  id="groupdescription"
                  class="form-control"
                  name="groupdescription"
                  value
                  required
                  autofocus
                  v-model="form.groupdescription"
                  placeholder="Group Description"
                  rows="5"
                ></textarea>
              </div>
              <div class="col-sm-12 text-right">
                <button class="btn btn-primary" @click="createGroup" v-if="!submitting">Create Group</button>
                <button class="btn btn-secondary" v-else>Submitting...</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
   <div class="container" v-else>
          <div class="row">
              <div class="col-sm-12">
                  <div class="card mt-4">
                    <div class="card-body">
                    	 <div class="card-body">
                        	 <div class="card-header">Access denied. Please contact your moderator or admin to again access</div>
                        </div>
                    </div>
                </div>
              </div>
          </div>
      </div>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import { required, email, numeric } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {
        groupname: "",
        groupdescription: "",
        grouptype: "public",
        groupstatus: "active",
        members: []
      },
      submitting: false,
      error: "",
      successmessage: ""
    };
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    goToGroupById(groupid) {
      this.$router.replace({
        name: "group",
        params: {
          groupid
        }
      });
    },
    validaterequest() {
      this.$v.$touch()
      if (this.$v.$invalid) {
            this.submitting = "false";
            return;
        }
        
    },
    createGroup() {
      this.submitting = true;
      
      if (this.user && this.user.loggedIn && this.user.data) {
        if (!this.form.groupname || !this.form.groupdescription) {
          this.error = `Enter all the required fields`;
          this.successmessage = "";
        } else {
          this.form.created_by = this.user.data.email || "Unknown user";
          this.form.members = [this.user.data.email];
          this.form.created_on = new Date();
          var db = firebase.firestore();
          db.collection("groups")
            .add(this.form)
            .then(docRef => {
              this.error = "";
              this.successmessage = `Group Created successfully. Group ID : ${docRef.id}. You will be redirected to the group shortly`;
              this.submitting = false;
              setTimeout(() => {
                this.goToGroupById(docRef.id);
              }, 3 * 1000);
            })
            .catch(err => {
              this.error = "Error while creating the group. Try agin later.";
              this.successmessage = "";
              this.submitting = false;
            });
        }
      } else {
        this.error = `You don't have permissions to create the group`;
        this.submitting = false;
      }
    }
  }
};
</script>