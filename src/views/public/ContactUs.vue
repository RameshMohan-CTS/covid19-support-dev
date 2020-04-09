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
      <div class="row mb-2">
        <div class="col-sm-12 text-right">
          <button class="btn btn-success">Leave a message to moderator</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <MarkdownDisplay
            v-if="app_settings && app_settings.page_contactus"
            :text="app_settings.page_contactus"
          />
          <div v-else>
            <h4>Contact us page</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import MarkdownDisplay from "@/components/MarkdownDisplay";
export default {
  components: {
    MarkdownDisplay,
  },
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Contact Us", active: true },
      ],
      form: {
        name: "",
        message: "",
      },
      error: null,
      status: "new",
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      app_settings: "app_settings",
    }),
  },
  methods: {
    validate() {
      if (this.user.loggedIn && this.user.data) {
        this.form.name = this.user.data.displayName || this.user.data.email;
        this.form.email = this.user.data.email;
      }
      if (!this.form.name) {
        (this.error = "Enter Your name and contact details"),
          (this.status = "error");
      }
      if (!this.form.message) {
        (this.error = "Enter Your message"), (this.status = "error");
      }
    },
    submitMessage() {
      this.validate();
      if (this.error) {
      } else {
        this.status = "validated";
        this.error = null;
        this.form.timestamp = new Date();
        var db = firebase.firestore();
        db.collection("messages")
          .add(this.form)
          .then((docRef) => {
            this.status = "submitted";
            this.error = null;
            setTimeout(() => {
              this.form.message = "";
              this.status = "new";
              this.error = null;
            }, 5 * 1000);
          })
          .catch((error) => {
            this.error = error;
            this.status = "error";
          });
      }
    },
  },
};
</script>
