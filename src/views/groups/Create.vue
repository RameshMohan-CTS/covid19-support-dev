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
import { creategroup } from "@/app/backend.js";
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
	  groups: {
	  	groups : []	  
	  },
	  group : {
	    groupid: "",
		groupname: ""
	  },
      submitting: false,
      error: "",
      successmessage: ""
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
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
              
              this.group.groupid=docRef.id;
			  this.group.groupname=this.form.groupname;
			  this.groups.groups.push(this.group);
			  this.creategroup();
			  
              setTimeout(() => {
			   // group details to application setting group doc
			     this.error = "";
              	this.successmessage = `Group Created successfully. Group ID : ${docRef.id}. You will be redirected to the group shortly`;
              	this.submitting = false;
                this.goToGroupById(docRef.id);
              }, 3 * 1000);
            })
            .catch(err => {
              this.error = "Error while creating the group. Try again later.";
              this.successmessage = "";
              this.submitting = false;
            });
        }
      } else {
        this.error = `You don't have permissions to create the group`;
        this.submitting = false;
      }
    },
    creategroup(){

		if(this.user && this.user.data && this.user.data.admin){
			try{
				let res = creategroup(this.group, this.user.data.email);
				this.error = "";
				this.status = "submitted"
			} catch(ex){
				alert("error");
				console.log(ex);
				this.error = "Failed to update the settings";
				this.status = "";
			}
		} else {
			this.error = "You don't have permissions to edit the settings";
			this.status = "";
			this.$router.replace({ name: "login" });
		}

		window.scroll(0,0);
	},
    async getgroup(){

		if(this.user && this.user.data && this.user.data.admin){
			try{
				let res = await getgroupaggrate(this.groups, this.user.data.email);
				console.log(res);
				this.error = "";
				this.status = "submitted"
				this.groups.groups=res;
			} catch(ex){
				alert("error");
				console.log(ex);
				this.error = "Failed to update the settings";
				this.status = "";
			}
		} else {
			this.error = "You don't have permissions to edit the settings";
			this.status = "";
			this.$router.replace({ name: "login" });
		}

		window.scroll(0,0);
	}
	
    /*,
	getApplicationgroup() {
	 console.log("getApplicationgroup");
		if (this.user != null) {
			if (this.user.loggedIn && this.user.data) {
				
			}
		}
	},		
	setApplicationgroup() {
	console.log("setApplicationgroup");
		if (this.user != null) {
			if (this.user.loggedIn && this.user.data) {
				console.log("before"+this.appsgroups);
				this.appsgroups.push( this.group);
				console.log("grps"+this.appsgroups);
                var db = firebase.firestore();
                db.collection("application_settings")
                    .doc("groups")
                    .set(this.appsgroups)
                    .then(docRef => {
                        setTimeout(() => {
                            this.status = "new";
                            this.error = null;
                        }, 5 * 1000);
                        this.updatevolprofile();
                        this.redirect();
                    })
                    .catch(error => {
                        console.error(error);
                        this.error = error;
                        this.status = "error";
                        this.isbutton = false;
                    });
			}
		}
	},*/
	
  }
};
</script>