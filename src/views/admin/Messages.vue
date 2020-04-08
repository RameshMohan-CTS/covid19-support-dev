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
      <div class="row">
        <div class="col-sm-8">
          <h4 class="text-primary mb-4">Messages</h4>
        </div>
        <div class="col-sm-4 text-right">
          <button
            class="btn btn-primary"
            v-if="mode === 'new_messages'"
            @click="
              mode = 'old_messages';
              fetchMessages();
            "
          >
            Show Read Messages
          </button>
          <button
            class="btn btn-primary"
            v-else
            @click="
              mode = 'new_messages';
              fetchMessages();
            "
          >
            Show Unread Messages
          </button>
        </div>
      </div>
      <div class="row">
        <b-modal
          title="Add Notes"
          v-model="addnotes_popup_visibilty"
          @ok="addNotes"
          ok-only
          ok-variant="primary"
        >
          <div class="row">
            <div class="col-sm-12">
              <textarea
                type="text"
                class="form-control"
                v-model="current_note"
                rows="5"
                placeholder="Enter your notes here"
              ></textarea>
            </div>
          </div>
        </b-modal>
        <div
          class="col-sm-12"
          v-for="(message, index) in messages"
          :key="index"
        >
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-1 text-center">
                  <i
                    v-if="!message.data.msg_read"
                    class="fa fa-envelope fa-lg"
                  ></i>
                  <i v-else class="fa fa-envelope-open fa-lg"></i>
                </div>
                <div class="col-sm-7">
                  <p>{{ message.data.message }}</p>
                </div>
                <div class="col-sm-4">
                  <p>{{ message.data.name }}</p>
                  <p>
                    {{ message.data.email || "Email address not provided" }}
                  </p>
                  <p>{{ message.data.phone || "Phone number not provided" }}</p>
                  <button
                    class="btn btn-sm btn-secondary mr-2 my-2"
                    @click="showAddNotesPopup(message.id)"
                  >
                    Add notes
                  </button>
                  <button
                    class="btn btn-sm btn-secondary mr-2 my-2"
                    v-if="message.data && message.data.notes.length > 0"
                    @click="showNotesPopup(message.id)"
                  >
                    Show {{ message.data.notes.length }} notes
                  </button>
                  <button
                    class="btn btn-sm btn-secondary mr-2 my-2"
                    v-if="!message.data.msg_read"
                    @click="markMsg(message.id, true)"
                  >
                    Mark as read
                  </button>
                  <button
                    class="btn btn-sm btn-secondary mr-2 my-2"
                    v-else
                    @click="markMsg(message.id, false)"
                  >
                    Mark as unread
                  </button>
                  <button
                    class="btn btn-sm btn-danger mr-2 my-2"
                    v-if="user && user.data && user.loggedIn && user.data.admin"
                    @click="deleteMsg(message.id)"
                  >
                    Delete message
                  </button>
                </div>
                <div>
                  <b-modal
                    title="Notes"
                    v-if="current_msg_id === message.id"
                    v-model="shownotes_popup_visibiity"
                    @ok="
                      shownotes_popup_visibiity = false;
                      current_msg_id = '';
                    "
                    ok-only
                    ok-variant="primary"
                  >
                    <div class="row">
                      <div
                        class="col-sm-12"
                        v-for="(note, index) in message.data.notes"
                        :key="index"
                      >
                        {{ note.note }}<br />
                        {{ note.noted_by }}<br />
                        {{
                          note.noted_on.seconds
                            ? new Date(note.noted_on.seconds * 1000)
                            : new Date()
                        }}
                        <hr />
                      </div>
                    </div>
                  </b-modal>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 text-center" v-if="messages.length === 0">
          No messages available at the moment
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import {
  messages_get_recent_messages,
  messages_delete_msg_by_id,
  messages_update_msg_status,
  messages_add_notes,
} from "@/app/backend";
export default {
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Admin", to: "/admin" },
        { text: "Messages to moderator", active: true },
      ],
      mode: "new_messages",
      addnotes_popup_visibilty: false,
      shownotes_popup_visibiity: false,
      current_msg_id: "",
      current_note: "",
      messages: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    async fetchMessages() {
      try {
        this.messages = await messages_get_recent_messages(
          this.mode === "new_messages" ? false : true
        );
      } catch (ex) {
        this.messages = [];
      }
    },
    async deleteMsg(msgid) {
      try {
        await messages_delete_msg_by_id(msgid);
        await this.fetchMessages();
      } catch (ex) {
        this.messages = [];
      }
    },
    async markMsg(msgid, status) {
      try {
        await messages_update_msg_status(msgid, status);
        await this.fetchMessages();
      } catch (ex) {
        this.messages = [];
      }
    },
    showAddNotesPopup(msgid) {
      this.addnotes_popup_visibilty = true;
      this.current_msg_id = msgid;
    },
    showNotesPopup(msgid) {
      this.current_msg_id = msgid;
      this.shownotes_popup_visibiity = true;
    },
    async addNotes() {
      this.addnotes_popup_visibilty = false;
      let msg = this.messages.find((msg) => msg.id === this.current_msg_id);
      if (msg && msg.data) {
        let notes = msg.data.notes || [];
        notes.push({
          note: this.current_note,
          noted_by: this.user.data.email,
          noted_on: new Date(),
        });
        try {
          await messages_add_notes(this.current_msg_id, notes);
        } catch (ex) {
          console.error("Error while adding notes");
        }
        this.current_msg_id = "";
        this.current_note = "";
      } else {
        this.current_msg_id = "";
        this.current_note = "";
      }
    },
  },
  created() {
    this.fetchMessages();
  },
  async created() {
    try {
      this.messages = await messages_get_recent_messages();
    } catch (ex) {
      this.messages = [];
    }
  },
};
</script>
