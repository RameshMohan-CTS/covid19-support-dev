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
      <div id="popups">
        <b-modal
          title="Error"
          v-model="error"
          @ok="clearError()"
          ok-only
          ok-variant="primary"
        >
          <div class="alert alert-danger">{{ errormsg }}</div>
        </b-modal>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <b-form-group
            label="Type of request"
            label-for="request_types"
            :label-cols="4"
          >
            <b-form-select
              id="request_type"
              :plain="true"
              :options="request_types"
              value="Please select"
              v-model="request_type"
            ></b-form-select>
          </b-form-group>
        </div>
        <div class="col-sm-6 mb-4">
          <input
            type="text"
            class="form-control"
            placeholder="Tracking ID"
            v-model="tracking_id"
          />
        </div>
        <div class="col-sm-6 mb-4">
          <input
            type="text"
            class="form-control"
            placeholder="Phone Number"
            v-model="phone"
          />
        </div>
        <div class="col-sm-6 mb-4">
          <input
            type="text"
            class="form-control"
            placeholder="Email Address"
            v-model="email"
          />
        </div>
        <div class="col-sm-12 text-center">
          <button v-if="submitting" class="btn btn-secondary">Loading..</button>
          <button v-else class="btn btn-primary" @click="requestTrace">
            Track Request Status
          </button>
        </div>
      </div>
      <div class="row" v-if="support_request && support_request.request">
        <div class="col-sm-12">
          <h5>Support Request details</h5>
        </div>
        <div class="col-sm-6 my-2">Category</div>
        <div class="col-sm-6 my-2">{{ support_request.request.category }}</div>
        <div class="col-sm-6 my-2">Title</div>
        <div class="col-sm-6 my-2">{{ support_request.request.title }}</div>
        <div class="col-sm-6 my-2">Description</div>
        <div class="col-sm-6 my-2">{{ support_request.request.detail }}</div>
        <div class="col-sm-6 my-2">Donation Status</div>
        <div class="col-sm-6 my-2">{{ support_request.request.status }}</div>
        <div class="col-sm-6 my-2">Created for</div>
        <div class="col-sm-6 my-2">
          {{ support_request.contact.email }} /
          {{ support_request.contact.phone }}
        </div>
      </div>
      <div class="row" v-else-if="donation && donation.donation">
        <div class="col-sm-12">
          <h5>Donation details</h5>
        </div>
        <div class="col-sm-6 my-2">Category</div>
        <div class="col-sm-6 my-2">{{ donation.donation.category }}</div>
        <div class="col-sm-6 my-2">Title</div>
        <div class="col-sm-6 my-2">{{ donation.donation.title }}</div>
        <div class="col-sm-6 my-2">Description</div>
        <div class="col-sm-6 my-2">{{ donation.donation.message }}</div>
        <div class="col-sm-6 my-2">Donation Status</div>
        <div class="col-sm-6 my-2">{{ donation.donation_status }}</div>
        <div class="col-sm-6 my-2">Donor details</div>
        <div class="col-sm-6 my-2">
          {{ donation.contact.email }} / {{ donation.contact.phone }}
        </div>
      </div>
      <div class="row" v-else-if="freshForm">
        <div class="col-sm-12"></div>
      </div>
      <div class="row" v-else>
        <div class="col-sm-12">
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { track_support_request, track_donation } from "@/app/backend";
export default {
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Track Request", active: true },
      ],
      freshForm: true,
      submitting: false,
      error: null,
      errormsg: "",
      request_types: ["support_request", "donation"],
      tracking_id: "",
      request_type: "support_request",
      phone: "",
      email: "",
      support_request: null,
      donation: null,
    };
  },
  methods: {
    validateFields() {
      return this.tracking_id && this.phone && this.email;
    },
    clearError() {
      this.error = false;
      this.errormsg = "";
    },
    async requestTrace() {
      if (this.validateFields()) {
        this.freshForm = false;
        this.submitting = true;
        if (this.request_type === "support_request") {
          try {
            let res = await track_support_request(
              this.tracking_id,
              this.phone,
              this.email
            );
            this.support_request = res;
            this.donation = null;
            this.submitting = false;
          } catch (ex) {
            this.error = true;
            this.errormsg = ex.msg;
            this.submitting = false;
            this.support_request = null;
            this.donation = null;
            this.freshForm = true;
          }
        } else if (this.request_type === "donation") {
          try {
            let res = await track_donation(
              this.tracking_id,
              this.phone,
              this.email
            );
            this.donation = res;
            this.support_request = null;
            this.submitting = false;
          } catch (ex) {
            this.error = true;
            this.errormsg = ex.msg;
            this.submitting = false;
            this.donation = null;
            this.support_request = null;
            this.freshForm = true;
          }
        }
      } else {
        this.error = true;
        this.errormsg = "Enter all fields";
      }
    },
  },
};
</script>
