<template>
  <div>
    <div class="container mt-4">
      <div
        v-if="user && user.loggedIn && user.data && (user.data.admin || user.data.moderator || user.data.verifiedvolunteer)"
      >
        <div class="row mt-4">
          <div class="col-sm-12">
            <div class="card mt-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-4">Filter By Status</div>
                  <div class="col-sm-8">
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'active' }}">Open</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'new' }}">New</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'pickedup' }}">Picked Up</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'waiting-for-pickup' }}">Waiting for pickup</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'closed' }}">Closed</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'support-requests-bystatus', params: { status : 'completed' }}">Completed</router-link></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12" v-if="supportrequests">
            <div class="card">
              <div class="card-header"><span class="btn btn-primary"><b>Support Requests</b></span>
                 <span v-if="pageNavButton">
                 <button type="button" class="btn btn-primary float-right" @click="lastPage(filterStatus)">&gt;&gt;</button>
                 <button type="button" class="btn btn-primary float-right ml-1" @click="nextPage(filterStatus)">&gt;</button>
                 <button type="button" class="btn btn-primary float-right" @click="prevPage(filterStatus)">&lt;</button>
                 <button type="button" class="btn btn-primary float-right" @click="fetchJobs()">&lt;&lt;</button>
                 </span>
              </div>
              <div class="card-body" v-if="supportrequests.length === pageSize || loadedFrom === 'base'">
                <div v-for="supportrequest in supportrequests" :key="supportrequest.id">
                  <span class="text-primary" style="font-size:16px;font-weight:bold;">
                    <router-link
                      :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                    >{{supportrequest.data.request.title || 'No Title'}}</router-link>
                  </span> - 
                  <span
                    style="font-size:16px;font-weight:light;"
                  >{{supportrequest.data.request.status || 'new'}}</span> -
                  <router-link
                    :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                  >More details</router-link>
                  <br />
                  For {{ supportrequest.data.contact.name || supportrequest.data.contact.email }} by
                  <i>{{supportrequest.data.user_displayName || supportrequest.data.user_email || 'Unknown User' }}</i>
                  <br />
                  <p>{{supportrequest.data.request.detail}}</p>
                  <hr />
                </div>
                </div>
              <div class="card-body" v-if="supportrequests.length != pageSize && loadedFrom === 'prev'">
                <div v-for="supportrequest in firstsetResults" :key="supportrequest.id">
                  <span class="text-primary" style="font-size:16px;font-weight:bold;">
                    <router-link
                      :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                    >{{supportrequest.data.request.title || 'No Title'}}</router-link>
                  </span> - 
                  <span
                    style="font-size:16px;font-weight:light;"
                  >{{supportrequest.data.request.status || 'new'}}</span> -
                  <router-link
                    :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                  >More details</router-link>
                  <br />
                  For {{ supportrequest.data.contact.name || supportrequest.data.contact.email }} by
                  <i>{{supportrequest.data.user_displayName || supportrequest.data.user_email || 'Unknown User' }}</i>
                  <br />
                  <p>{{supportrequest.data.request.detail}}</p>
                  <hr />
                </div>
              </div>
              <div class="card-body" v-if="supportrequests.length != pageSize && loadedFrom === 'next'">
                <div v-for="supportrequest in lastsetResults" :key="supportrequest.id">
                  <span class="text-primary" style="font-size:16px;font-weight:bold;">
                    <router-link
                      :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                    >{{supportrequest.data.request.title || 'No Title'}}</router-link>
                  </span> - 
                  <span
                    style="font-size:16px;font-weight:light;"
                  >{{supportrequest.data.request.status || 'new'}}</span> -
                  <router-link
                    :to="{ name: 'supportrequest', params: { supportrequestid: supportrequest.id }}"
                  >More details</router-link>
                  <br />
                  For {{ supportrequest.data.contact.name || supportrequest.data.contact.email }} by
                  <i>{{supportrequest.data.user_displayName || supportrequest.data.user_email || 'Unknown User' }}</i>
                  <br />
                  <p>{{supportrequest.data.request.detail}}</p>
                  <hr />
                </div>
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
var db = firebase.firestore();

export default {
  data() {
    return {
      supportrequests: null,
      pageSize: 5,
      firstSupportRequest: null,
      lastSupportRequest: null,
      filterStatus: [],
      prevNavStatus: false,
      nextNavStatus: false,
      loadedFrom:"base",
      firstsetResults: [],
      lastsetResults:[],
      pageNavButton:false
    };
  },
  watch: {
    '$route.params.status': function (id) {
      this.fetchJobs()
    }
  },
  methods: {
    pageNavStatusCheck() {
        if(this.supportrequests <this.pageSize) {
           this.pageNavButton=false;
       } else {
           this.pageNavButton=true;
       }
    },
    getAllJobs() {
      return db
        .collection("support_requests")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();
    },
    getActiveJobs() {
      return db
        .collection("support_requests")
        .where("request.status", "in", this.filterStatus)
        .orderBy("timestamp", "desc")
        .limit(this.pageSize)
        .get();
    },
    getJobsByStatus(filterStatus) {
      this.filterStatus=filterStatus;
      return db
        .collection("support_requests")
        .where("request.status", "in", filterStatus)
        .orderBy("timestamp", "desc")
        .limit(this.pageSize)
        .get();
    },
    nextPage(filterStatus) {
      this.filterStatus=filterStatus;
      this.loadedFrom="next";
      return db
        .collection("support_requests")
        .where("request.status", "in", filterStatus)
        .orderBy("timestamp", "desc")
        .startAfter(this.lastSupportRequest)
        .limit(this.pageSize)
        .get()
        .then(querySnapshot => {
          this.supportrequests = this.getSupportRequests(querySnapshot);
          if(this.supportrequests.length==0){
            this.lastPage(this.filterStatus);lastsetResults
          } else if(this.supportrequests.length<this.pageSize) {
            this.lastsetResults=this.supportrequests
          }
        }); 
   },
   prevPage(filterStatus) {
    this.filterStatus=filterStatus;
    this.supportrequests =[];
    this.loadedFrom="prev";
    return db
        .collection("support_requests")
        .where("request.status", "in", filterStatus)
        .orderBy("timestamp", "desc")
        .endBefore(this.firstSupportRequest)
        .limitToLast(this.pageSize)
        .get()
        .then(querySnapshot => {
          this.supportrequests = this.getSupportRequests(querySnapshot);
        }); 
  },
   lastPage(filterStatus) {
    this.filterStatus=filterStatus;
    this.loadedFrom="base";
    if(this.lastsetResults.length>0) {
      this.supportrequests = this.lastsetResults;
      return;
    }
    return db
        .collection("support_requests")
        .where("request.status", "in", filterStatus)
        .orderBy("timestamp", "asc")
        .limit(this.pageSize)
        .get()
        .then(querySnapshot => {
          this.supportrequests = this.getSupportRequests(querySnapshot);
          this.lastsetResults=this.supportrequests;
        });
  },
  getSupportRequests(querySnapshot){
    let support_requests = [];
    let i=0;
    querySnapshot.forEach(doc => {
      if(i==0){
        this.firstSupportRequest = doc;
      }

      if(i == (this.pageSize -1)) {
        this.lastSupportRequest = doc;
      }
       i++;
      support_requests.push({
              id: doc.id,
              data: doc.data()
        });
    });

    return support_requests;

  },
  fetchJobs() {
      const filter_status = this.$route.params.status;
      this.supportrequests =[];
      this.firstsetResults=[];

      if (!filter_status || filter_status === "active" || filter_status === "open") {
        this.filterStatus=["new", "pickedup", "waiting-for-pickup"];
        this.getActiveJobs().then(querySnapshot => {
          this.supportrequests = this.getSupportRequests(querySnapshot);
          this.firstsetResults=this.supportrequests;
          this.pageNavStatusCheck();
        });
      } else {
        if (filter_status) {
          this.filterStatus=[];
          this.filterStatus.push(filter_status);
        }
        this.getJobsByStatus(this.filterStatus).then(querySnapshot => { 
          this.supportrequests = this.getSupportRequests(querySnapshot);
          this.firstsetResults=this.supportrequests;
          this.pageNavStatusCheck();
        });
      } 
    }
  },
  created() {
    this.fetchJobs();
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

