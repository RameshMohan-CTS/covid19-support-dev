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
  },
};
</script>
