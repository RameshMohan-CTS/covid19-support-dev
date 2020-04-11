<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="supportrequest">
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div
                class="card-body"
                v-if="
                  supportrequest &&
                    supportrequest.request &&
                    supportrequest.contact
                "
              >
                <h4 class="text-primary">{{ supportrequest.request.title }}</h4>
                <div class="row my-4">
                  <div class="col-sm-4">Status</div>
                  <div class="col-sm-8">
                    {{ supportrequest.request.status || "New / UnAssigned" }}
                  </div>
                </div>
                <div
                  class="row my-4"
                  v-if="supportrequest.request.status === 'pickedup'"
                >
                  <div class="col-sm-4">Pickup Status</div>
                  <div class="col-sm-8">
                    Picked up by {{ supportrequest.picked_up_by }} on
                    {{ new Date(supportrequest.picked_up_on.seconds * 1000) }}
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col-sm-4">Details</div>
                  <div class="col-sm-8">
                    {{ supportrequest.request.detail || "No details provided" }}
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col-sm-4">Requested for</div>
                  <div class="col-sm-8">
                    {{ supportrequest.contact.name || "Not Available" }}
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col-sm-4">Contact Address</div>
                  <div class="col-sm-8">
                    {{ supportrequest.contact.address || "Not Available" }}
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col-sm-4">Contact Phone</div>
                  <div class="col-sm-8">
                    {{ supportrequest.contact.phone || "Not Available" }}
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col-sm-4">Contact Email</div>
                  <div class="col-sm-8">
                    {{ supportrequest.contact.email || "Not Available" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row"
          v-if="
            user &&
              user.loggedIn &&
              user.data &&
              user.data.moderator &&
              supportrequest &&
              supportrequest.request.status === 'new'">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-if="success" class="alert alert-success">{{ success }}</div>
                <h5 class="text-primary">Assign to Volunteer</h5>
                <div class="row">
                  <div role="group" class="col-sm-8">
                    <b-form-group
                      label="Select a Volunteer Group"
                      label-for="basicSelect"
                      :label-cols="4">
                      <b-form-select
                        id="basicSelect"
                        :plain="true"
                        :options="groups"
                        value="Select a group"
                        v-model="selectedGroup"
                        @change="fetchVolunteers">
                        </b-form-select>
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div role="group" class="col-sm-8">
                    <b-form-group
                      label="Select a Volunteer"
                      label-for="basicSelect"
                      :label-cols="4">
                      <b-form-select
                        id="basicSelect"
                        :plain="true"
                        :options="volunteers"
                        value="Select a volunteer"
                        v-model="volunteerEmail"></b-form-select>
                    </b-form-group>
                  </div>
                  <div class="col-sm-4">
                    <div class="text-right mr-4">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="AssignToVolunteer">
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 text-right">
            <div
              class="card"
              v-if="
                user &&
                  user.data &&
                  user.data.verifiedvolunteer &&
                  supportrequest &&
                  supportrequest.request &&
                  (supportrequest.request.status === '' ||
                    supportrequest.request.status === 'new')
              "
            >
              <div class="card-body">
                <button
                  class="btn btn-primary mr-4"
                  v-if="
                    supportrequest.request.status === '' ||
                      supportrequest.request.status === 'new'
                  "
                  @click="pickupJobMyself"
                >
                  Assign to myself
                </button>
              </div>
            </div>
            <div
              class="card"
              v-if="
                user &&
                  user.data &&
                  supportrequest &&
                  supportrequest.request &&
                  supportrequest.picked_up_by === user.data.email &&
                  (supportrequest.request.status === 'pickedup' ||
                    supportrequest.request.status === 'inprogress')
              "
            >
              <div class="card-body">
                <button class="btn btn-primary mr-4" @click="releaseJob">
                  Release Job
                </button>
                <button
                  class="btn btn-primary mr-4"
                  @click="markJobAsCompleted"
                >
                  Complete Job
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row"
          v-if="supportrequest_history && supportrequest_history.length > 0"
        >
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <h5 class="text-primary">Support Request History</h5>
                <div
                  v-for="(history, index) in supportrequest_history"
                  :key="index"
                  class="row"
                >
                  <div class="col-sm-12 py-2" v-if="history && history.data">
                    {{ history.data.message || "-----------------" }} by
                    <i>{{ history.data.sender }}</i> on
                    {{ new Date(history.data.timestamp.seconds * 1000) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <h5 class="text-primary">Comments</h5>
                <div v-if="supportrequest_comments">
                  <div
                    v-for="(comment, index) in supportrequest_comments"
                    :key="index"
                    class="row"
                  >
                    <div class="col-sm-12 py-2" v-if="comment && comment.data">
                      {{ comment.data.comment || "-----------------" }}
                      <br />-
                      <i>{{ comment.data.commentor }}</i>
                      - {{ new Date(comment.data.timestamp.seconds * 1000) }}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <fieldset role="group" class="b-form-group form-group">
                      <div role="group" class>
                        <textarea
                          id="newcomment"
                          type="text"
                          placeholder="Comment"
                          class="form-control"
                          rows="3"
                          v-model="newcomment"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-8"></div>
                  <div class="col-sm-4">
                    <div class="text-right mr-4">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="submitComment"
                      >
                        Submit Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="isAdmin || canCloseJob">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body text-right">
                <button
                  class="btn btn-danger mr-4"
                  @click="deleteJob"
                  v-if="isAdmin"
                >
                  Delete Job
                </button>
                <button
                  class="btn btn-danger mr-4"
                  @click="markJobAsClosed"
                  v-if="canCloseJob"
                >
                  Close Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-sm-12">
          <h4>Loading...</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import {
  submitComment,
  submitAudit,
  fetchSupportRequestById,
  deleteSupportRequest,
  updateSupportRequestStatus,
  fetchCommentsForSupportRequest,
  fetchHistoryForSupportRequest,
} from "@/app/backend.js";
export default {
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Support Requests List", to: "/support-requests" },
        { text: "Request Details", active: true },
      ],
      supportrequestid: "",
      newcomment: "",
      supportrequest: null,
      supportrequest_comments: [],
      supportrequest_history: [],
      volunteerEmail: "",
      groups: [],
      volunteers: [],
      selectedGroup: null,
      selectedVolunteer: null,
      error: "",
      success: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      isLoggedInUser: "isLoggedInUser",
      isAdmin: "isAdmin",
    }),
    isJobOwner() {
      return (
        this.isLoggedInUser &&
        this.$route.params.supportrequestid &&
        this.supportrequest &&
        this.supportrequest.user_email === this.user.data.email
      );
    },
    canCloseJob() {
      return (
        this.isJobOwner &&
        ["new"].indexOf(this.supportrequest.request.status) > -1
      );
    },
  },
  created() {
    this.fetchJob();
    this.fetchComments();
    this.fetchAuditHistory();
    this.fetchGroups();
  },
  methods: {
    async fetchJob() {
      try {
        this.supportrequest = await fetchSupportRequestById(
          this.$route.params.supportrequestid
        );
      } catch (ex) {
        this.supportrequest = {};
      }
    },
    async fetchComments() {
      try {
        this.supportrequest_comments = await fetchCommentsForSupportRequest(
          this.$route.params.supportrequestid
        );
      } catch (ex) {
        this.supportrequest_comments = [];
      }
    },
    async fetchAuditHistory() {
      try {
        this.supportrequest_history = await fetchHistoryForSupportRequest(
          this.$route.params.supportrequestid
        );
      } catch (ex) {
        this.supportrequest_history = [];
      }
    },
    async submitComment() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid
      ) {
        await submitComment(
          "support_request",
          this.$route.params.supportrequestid,
          this.newcomment,
          this.user.data.email
        );
        await this.fetchComments();
      }
    },
    async pickupJobMyself() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid
      ) {
        await updateSupportRequestStatus(
          this.$route.params.supportrequestid,
          this.supportrequest,
          "pickedup",
          this.user.data.email
        );
        this.sendEmailNotificationOnAssigned(this.user.data.email);
        await this.fetchAuditHistory();
      }
    },
    async releaseJob() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid
      ) {
        await updateSupportRequestStatus(
          this.$route.params.supportrequestid,
          this.supportrequest,
          "new",
          this.user.data.email
        );
        await this.fetchAuditHistory();
      }
    },
    async markJobAsCompleted() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid
      ) {
        await updateSupportRequestStatus(
          this.$route.params.supportrequestid,
          this.supportrequest,
          "completed",
          this.user.data.email
        );
        await this.fetchAuditHistory();
      }
    },
    async markJobAsClosed() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid &&
        this.supportrequest &&
        this.supportrequest.user_email === this.user.data.email
      ) {
        await updateSupportRequestStatus(
          this.$route.params.supportrequestid,
          this.supportrequest,
          "closed",
          this.user.data.email
        );
        await this.fetchAuditHistory();
      } else {
        console.log("unable to mark job as closed");
      }
    },

    async deleteJob() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid &&
        this.user.data.admin
      ) {
        await deleteSupportRequest(
          this.$route.params.supportrequestid,
          this.user.data.email
        );
        this.$router.replace({
          name: "support-requests",
        });
      }
    },

    async fetchGroups() {
      if (this.user && this.user.data && this.user.data.moderator) {
        var db = firebase.firestore();
        let groupMaps = [];
        let _groups = [];
        await db
          .collection("aggregated_data")
          .doc("groups")
          .get()
          .then((docRef) => {
            groupMaps = docRef.data().groups;
          })
          .catch((err) => {
            console.log("error fetching groups: ", err);
          });
        for (var i = 0; i <= groupMaps.length - 1; i++) {
          _groups.push(groupMaps[i].groupname);
        }
        this.groups = _groups;
      }
    },

    async fetchVolunteers() {
      if (this.user && this.user.data && this.user.data.moderator
          && this.selectedGroup) {
        var db = firebase.firestore();
        let _volunteers = [];
        await db
          .collection("groups")
          .where("groupname", "==", this.selectedGroup)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              _volunteers = doc.data().members;
            });
          })
          .catch((err) => {
            console.log("error fetching volunteers: ", err);
          });
        this.volunteers = _volunteers;
      }
    },

    fetchUserDetails(u) {
      var db = firebase.firestore();
      return db
        .collection("user_profiles")
        .doc(u)
        .get();
    },

    async AssignToVolunteer() {
      if (
        this.user &&
        this.user.data &&
        this.user.data.email &&
        this.$route.params.supportrequestid &&
        this.volunteerEmail
      ) {
        this.error = "";
        this.success = "";
        var db = firebase.firestore();
        var userdetails = null;
        await this.fetchUserDetails(this.volunteerEmail).then((doc) => {
          console.log(doc.id, "=>", doc.data());
          userdetails = doc.data();
        });

        if (!userdetails) {
          this.error = "Invalid user Id";
          return;
        }
        if (!userdetails.isverifiedvolunteer && !userdetails.ismoderator) {
          this.error = "User is not a Verified Volunteer or Moderator";
          return;
        }
        await updateSupportRequestStatus(
          this.$route.params.supportrequestid,
          this.supportrequest,
          "pickedup",
          this.volunteerEmail
        );
        await this.fetchAuditHistory();        
        this.success = "Successfully assigned";       

        this.sendEmailNotificationOnAssigned(this.volunteerEmail);
      }
    },

    fetchEmailContent(){      
      return firebase.firestore()
        .collection("email_settings")
        .doc("request_assignment")
        .get();
    },

    async sendEmailNotificationOnAssigned(volntrEmail) {

      var emailSubject = ""
      var textMessage = ""
      var htmlMessage = ""

      await this.fetchEmailContent()
            .then(doc => {          
          emailSubject = doc.data().subject;
          textMessage = doc.data().text_message;
          htmlMessage = doc.data().html_message;
        });

        textMessage = textMessage.replace('$$BENEFICIARYNAME$$', this.supportrequest.contact.name);
        textMessage = textMessage.replace('$$REQUESTID$$', this.$route.params.supportrequestid);
        textMessage = textMessage.replace('$$REQUESTTITLE$$', this.supportrequest.request.title);
        textMessage = textMessage.replace('$$VOLUNTEEREMAIL$$', volntrEmail);

        htmlMessage = htmlMessage.replace('$$BENEFICIARYNAME$$', this.supportrequest.contact.name);
        htmlMessage = htmlMessage.replace('$$REQUESTID$$', this.$route.params.supportrequestid);
        htmlMessage = htmlMessage.replace('$$REQUESTTITLE$$', this.supportrequest.request.title);
        htmlMessage = htmlMessage.replace('$$VOLUNTEEREMAIL$$', volntrEmail);

      const sendEmail = firebase
        .functions()
        .httpsCallable("sendEmailNotification");
      sendEmail({
        recipients: this.supportrequest.contact.email + ';' +  this.supportrequest.requestor.email,  
        copiedRecipients: volntrEmail,
        subject: emailSubject,
        mailContentPlainText:  textMessage,           
        mailContentHtml: htmlMessage
      })
        .then(
          setTimeout(() => {
            this.success = "Successfully assigned and email sent";
          }, 5 * 1000)
        )
        .catch((err) => {
          console.log(err);
        });      
    }
  },
};
</script>
