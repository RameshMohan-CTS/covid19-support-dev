<template>
  <div>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
            <b-breadcrumb :items="breadcrumbs" />
        </div> 
     </div>
     <div
        v-if="user && user.loggedIn && user.data && (user.data.moderator || user.data.verifiedvolunteer)"
      >
        <div class="row mt-2">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-4">Filter By Status</div>
                  <div class="col-sm-8">
                      <span class="mx-2"><router-link :to="{name:'donations-bystatus', params: { status : 'all' }}">All</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'donations-bystatus', params: { status : 'new' }}">New</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'donations-bystatus', params: { status : 'assigned' }}">Assigned</router-link></span>
                      <span class="mx-2"><router-link :to="{name:'donations-bystatus', params: { status : 'fulfilled' }}">Fulfilled</router-link></span>                     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12" v-if="donations">
            <div class="card">
              <div class="card-header"><span class="btn btn-primary"><b>Donations</b></span>
                          <span v-if="pageNavButton">
                                <button type="button" class="btn btn-primary float-right" @click="lastPage()" v-if="lastButtonStatus">&gt;&gt;</button>
                                <button type="button" class="btn btn-primary float-right" v-if="!lastButtonStatus">&gt;&gt;</button>
                                <button type="button" class="btn btn-primary float-right ml-1" @click="nextPage()" v-if="nextNavStatus">&gt;</button>
                                <button type="button" class="btn btn-primary float-right ml-1" v-if="!nextNavStatus">&gt;</button>
                                <button type="button" class="btn btn-primary float-right" @click="prevPage()" v-if="prevNavStatus">&lt;</button>
                                <button type="button" class="btn btn-primary float-right" v-if="!prevNavStatus">&lt;</button>
                                <button type="button" class="btn btn-primary float-right" @click="fetchDonations()" v-if="firstButtonStatus">&lt;&lt;</button>
                                <button type="button" class="btn btn-primary float-right" v-if="!firstButtonStatus">&lt;&lt;</button>
                          </span>
              </div>
              <div class="card-body">
                <div v-for="donation in donations" :key="donation.id">
                  <span class="text-primary" style="font-size:16px;font-weight:bold;">
                    <router-link
                      :to="{ name: 'donation', params: { donationid: donation.id }}"
                    >{{donation.data.donation.title || 'No Title'}}</router-link>
                  </span> -
                  <span
                    style="font-size:16px;font-weight:light;"
                  >{{donation.data.donation_status || 'new'}}</span>                  
                  <br />
                  Donor - {{ donation.data.contact.firstname + " " + donation.data.contact.lastname || donation.data.contact.email }} entered by
                  <i>{{donation.data.user_displayName || donation.data.user_email || 'Unknown User' }}</i>
                  <br />
                  <p>{{donation.data.donation.message}}</p>
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
      donations: null,
      filterStatus: "all",
      pageSize:5,
      loadedFrom: "base",
      firstDonation: null,
      lastDonation: null,
      pageNavButton: false,
      firstButtonStatus: false,
      prevNavStatus: false,
      nextNavStatus: true,
      lastButtonStatus: true,
      breadcrumbs : [
                { text : "Home", to : "/" },
                { text : "Donations", active : true }
            ]
    };
  },
  watch: {
    '$route.params.status': function (id) {
      this.fetchDonations()
    }
  },
  methods: {
    getDonations() {
            let donationList = null
            if(this.user.data.moderator){
              donationList = db
                .collection("donations")
            } else {
              donationList = db
                .collection("donations")
                .where("picked_up_by", "==", this.user.data.email)
            }
            if (this.filterStatus === "new") {
                donationList = donationList.where("donation_status", "==", this.filterStatus)
            } else if (this.filterStatus === "assigned") {
                donationList = donationList.where("donation_status", "==", this.filterStatus)
            } else if (this.filterStatus === "fulfilled") {
                donationList = donationList.where("donation_status", "==", this.filterStatus)
            }
            return donationList;
    },
    getDonationsByParam() {
       return this.getDonations()   
        .orderBy("timestamp", "desc")
        .limit(this.pageSize)
        .get();  
    },
    fetchDonations() {
      if(this.$route.params.status)
      this.filterStatus = this.$route.params.status;
      let _donations = [];
        this.getDonationsByParam().then(querySnapshot => {
          this.donations = this.getDonationResults(querySnapshot);
          if(this.donations.length <this.pageSize) {
           this.pageNavButton=false;
          } else {
          this.pageNavButton=true;
          this.firstButtonStatus=false;
          this.prevNavStatus=false;
          this.nextNavStatus=true;
          this.lastButtonStatus=true;
          }
        });
    },nextPage() {
		    let _donations = [];
            this.loadedFrom = "next";
            return this.getDonations()
                .orderBy("timestamp","desc")
                .startAfter(this.lastDonation)
                .limit(this.pageSize)
                .get()
                .then(querySnapshot => {
                    this.donations = this.getDonationResults(querySnapshot);
                    if (this.donations.length < this.pageSize) {
                        this.lastPage(this.filterStatus);
                        this.firstButtonStatus=true;
                        this.prevNavStatus=true;
                        this.nextNavStatus=false;
                        this.lastButtonStatus=false;
                    } else {
                        this.firstButtonStatus=true;
                        this.prevNavStatus=true;
                        this.nextNavStatus=true;
                        this.lastButtonStatus=false;
                    }
                });
        },
        prevPage() {
            let _donations = [];
            this.loadedFrom = "prev";
            return this.getDonations()
                .orderBy("timestamp","desc")
                .endBefore(this.firstDonation)
                .limitToLast(this.pageSize)
                .get()
                .then(querySnapshot => {
				            this.donations = this.getDonationResults(querySnapshot);
                    if (this.donations.length < this.pageSize) {
                        this.fetchDonations();
                        this.firstButtonStatus=false;
                        this.prevNavStatus=true;
                        this.nextNavStatus=true;
                        this.lastButtonStatus=true;
                    } else {
                        this.firstButtonStatus=true;
                        this.prevNavStatus=true;
                        this.nextNavStatus=true;
                        this.lastButtonStatus=true;
                    }
                });
        },
        lastPage() {
		    let _donations = [];
            this.loadedFrom = "base";
            return this.getDonations()
                .orderBy("timestamp", "asc")
                .limit(this.pageSize)
                .get()
                .then(querySnapshot => {
                this.donations = this.getDonationResults(querySnapshot);
                this.firstButtonStatus=true;
                this.prevNavStatus=true;
                this.nextNavStatus=false;
                this.lastButtonStatus=false;
                });                 
        }, 
        getDonationResults(querySnapshot) {
            let _donations = [];
            let i = 0;
            querySnapshot.forEach(doc => {
                if (i == 0) {
                    this.firstDonation = doc;
                }

                if (i == (this.pageSize - 1)) {
                    this.lastDonation = doc;
                }
                i++;
                _donations.push({
                    id: doc.id,
                    data: doc.data()
                });
            });

            this.donations = _donations;

            return _donations;

        }
  },
  created() {
      this.fetchDonations();
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>