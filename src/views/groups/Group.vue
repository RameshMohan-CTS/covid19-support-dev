<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
    </div>
    <div class="container px-4">
      <div class="row" v-if="error">
        <div class="col-sm-12">
          <div class="alert alert-danger">{{ error }}</div>
        </div>
      </div>
      <div class="row" v-if="successmessage">
        <div class="col-sm-12">
          <div class="alert alert-success">{{ successmessage }}</div>
        </div>
      </div>
      <div class="row" v-if="group && group.groupstatus === 'active'">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              {{ group.groupname || "Group Detail" }} (
              {{ group.members.length }} Members )
            </div>
            <div class="card-body">{{ group.groupdescription }}</div>
          </div>
        </div>
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body text-right">
              <div class="form-inline text-right">
                <div
                  v-if="
                    user &&
                      user.data &&
                      (user.data.admin || user.data.moderator)
                  "
                >
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Email of the user"
                    v-model="invited_member_email"
                    id="invited_member_email"
                  />
                  <button
                    class="btn btn-primary mx-2"
                    @click="addOthersTotheGroup"
                  >
                    Add others to group
                  </button>
                </div>
                <div
                  v-if="
                    group &&
                      group.members &&
                      user &&
                      user.data &&
                      group.members.indexOf(user.data.email) === -1
                  "
                >
                  <button
                    class="btn btn-primary"
                    @click="addYourselfTotheGroup"
                  >
                    Add Youself to group
                  </button>
                </div>
                <div
                  v-if="
                    group &&
                      group.members &&
                      user &&
                      user.data &&
                      group.members.indexOf(user.data.email) > -1
                  "
                >
                  <button
                    class="btn btn-primary"
                    @click="removeYouselffromtheGroup"
                  >
                    Leave Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-sm-12"
          v-if="
            user &&
              user.data &&
              (user.data.admin ||
                user.data.moderator ||
                group.members.indexOf(user.data.email) > -1)
          "
        >
          <div class="card">
            <div class="card-header">Members</div>
            <div class="card-body">
              <div
                v-for="(member, index) in group.members"
                :key="index"
                class="my-2"
              >
                {{ member }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="group && group.groupstatus === 'disabled'">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">This group is not available.</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">Loading..</div>
          </div>
        </div>
      </div>
      <div v-if="user && user.data && user.data.admin && user.loggedIn">
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <button class="btn btn-danger" @click="deleteGroup">
                  Delete Group
                </button>
              </div>
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
import * as _ from "lodash";
export default {
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Groups", to: "/groups" },
        { text: "Group Details", active: true },
      ],
      invited_member_email: "",
      group: null,
      error: "",
      successmessage: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    this.fetchGroup();
  },
  methods: {
    canAddUserToGroup() {
      return (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        (this.user.data.admin ||
          this.user.data.moderator ||
          this.user.data.verifiedvolunteer)
      );
    },
    fetchGroup() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.groupid
      ) {
        var db = firebase.firestore();
        db.collection("groups")
          .doc(this.$route.params.groupid)
          .get()
          .then((docRef) => {
            let group = docRef.data();
            this.group = group;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    addYourselfTotheGroup() {
      this.addUserTotheGroup(this.user.data.email);
    },
    addOthersTotheGroup() {
      this.addUserTotheGroup(this.invited_member_email);
    },
    addUserTotheGroup(email) {
      if (this.group.members.indexOf(email) > -1) {
        this.error = "User already part of this group";
        this.successmessage = "";
        setTimeout(() => {
          this.successmessage = ``;
          this.error = ``;
        }, 5 * 1000);
      } else if (this.canAddUserToGroup() && email && email.indexOf("@") > -1) {
        this.group.members = this.group.members || [];
        this.group.members = _.uniq(this.group.members.concat(email));
        var db = firebase.firestore();
        var docRef = db.collection("groups").doc(this.$route.params.groupid);
        docRef
          .set(this.group, { merge: true })
          .then((result) => {
            this.fetchGroup();
            this.error = ``;
            this.successmessage = `User added to group`;
            setTimeout(() => {
              this.successmessage = ``;
              this.error = ``;
            }, 5 * 1000);
          })
          .catch((err) => {
            this.error = "Error updating the group";
            this.successmessage = "";
            setTimeout(() => {
              this.successmessage = ``;
              this.error = ``;
            }, 5 * 1000);
          });
      } else {
        this.error = "Can't add to the group";
        this.successmessage = "";
        setTimeout(() => {
          this.successmessage = ``;
          this.error = ``;
        }, 5 * 1000);
      }
    },
    removeYouselffromtheGroup() {
      if (
        this.user &&
        this.user.data &&
        this.group.members.indexOf(this.user.data.email) > -1
      ) {
        this.group.members = this.group.members || [];
        this.group.members = this.group.members.filter(
          (e) => e !== this.user.data.email
        );
        var db = firebase.firestore();
        var docRef = db.collection("groups").doc(this.$route.params.groupid);
        docRef
          .set(this.group, { merge: true })
          .then((result) => {
            this.fetchGroup();
            this.error = ``;
            this.successmessage = `User removed from group`;
            setTimeout(() => {
              this.successmessage = ``;
              this.error = ``;
            }, 5 * 1000);
          })
          .catch((err) => {
            this.error = "Error updating the group";
            this.successmessage = "";
            setTimeout(() => {
              this.successmessage = ``;
              this.error = ``;
            }, 5 * 1000);
          });
      } else {
        this.error = "Can't remove from the group";
        this.successmessage = "";
        setTimeout(() => {
          this.successmessage = ``;
          this.error = ``;
        }, 5 * 1000);
      }
    },
    deleteGroup() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.admin &&
        this.user.loggedIn &&
        this.group
      ) {
        var db = firebase.firestore();
        db.collection("groups")
          .doc(this.$route.params.groupid)
          .delete()
          .then((docRef) => {
            this.$router.replace({
              name: "groups",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
