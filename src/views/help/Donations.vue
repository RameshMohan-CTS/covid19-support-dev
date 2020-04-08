<template>
  <div>
    <div class="container mt-4">
      <div
        v-if="user && user.loggedIn && user.data && (user.data.moderator || user.data.verifiedvolunteer)"
      >
        <div class="row mt-4">
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
              <div class="card-header">Donations</div>
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
                  Donor - {{ donation.data.contact.name || donation.data.contact.email }} entered by
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
      donations: null
    };
  },
  watch: {
    '$route.params.status': function (id) {
      this.fetchDonations()
    }
  },
  methods: {

    getAllDonations() {
      if(this.user.data.moderator){
         return db
        .collection("donations")            
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();         
      }
      return db
        .collection("donations")
        .where("picked_up_by", "==", this.user.data.email)        
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();
          
    },
    getDonationsByStatus(s) {
      if(this.user.data.moderator){
        return db
        .collection("donations")
        .where("donation_status", "==", s)
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();        
      }
      return db
        .collection("donations")
        .where("donation_status", "==", s)
        .where("picked_up_by", "==", this.user.data.email)
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();      
    },
    fetchDonations() {
      const filter_status = this.$route.params.status;
      let _donations = [];
      if (!filter_status || filter_status === "all") {
        this.getAllDonations().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            _donations.push({
              id: doc.id,
              data: doc.data()
            });
          });
          this.donations = _donations;
        });
      } else {
        this.getDonationsByStatus(filter_status).then(querySnapshot => { 
          querySnapshot.forEach(doc => {
            _donations.push({
              id: doc.id,
              data: doc.data()
            });
          });
          this.donations = _donations;
        });
      }
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