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
            <div class="animated fadeIn">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                <div>
                                    <strong>Personal Details</strong>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="firstname">First Name*</label>
                                                <input
                                                    id="firstname"
                                                    type="text"
                                                    placeholder="First name"
                                                    class="form-control"
                                                    v-model="form.personal.firstname"
                                                    :class="{ 'is-invalid': submitted && $v.form.personal.firstname.$error }" />
                                                <div v-if="submitted && $v.form.personal.firstname.$error" class="invalid-feedback">
                                                    <span v-if="!$v.form.personal.firstname.required">First Name is required</span>
                                                </div>
                                            </div>

                                        </fieldset>
                                    </div>
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="lastname">Last Name*</label>
                                                <input
                                                    id="lastname"
                                                    type="text"
                                                    placeholder="Last name"
                                                    class="form-control"
                                                    v-model="form.personal.lastname"
                                                    :class="{ 'is-invalid': submitted && $v.form.personal.lastname.$error }" />
                                                <div v-if="submitted && $v.form.personal.lastname.$error" class="invalid-feedback">
                                                    <span v-if="!$v.form.personal.lastname.required">Last Name is required</span>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="idtype">Primary ID Type</label>
                                                <input
                                                    id="idtype"
                                                    type="text"
                                                    placeholder="Eg: Passport Number, Driving License Number etc.."
                                                    class="form-control"
                                                    v-model="form.personal.idtype" />
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="idproof">Primary ID Number*</label>
                                                <input
                                                    id="idproof"
                                                    type="text"
                                                    placeholder="Eg: Passport Number, Driving License Number etc.."
                                                    class="form-control"
                                                    v-model="form.personal.idproof"
                                                    :class="{ 'is-invalid': submitted && $v.form.personal.idproof.$error }" />
                                                <div v-if="submitted && $v.form.personal.idproof.$error" class="invalid-feedback">
                                                    <span v-if="!$v.form.personal.idproof.required">Primary ID is required</span>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="sidtype">Secondary ID Type</label>
                                                <input
                                                    id="sidtype"
                                                    type="text"
                                                    placeholder="Eg: Passprot, Driving License, BRP etc.."
                                                    class="form-control"
                                                    v-model="form.personal.sidtype" />
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="sidproof">Secondary ID Number</label>
                                                <input
                                                    id="sidproof"
                                                    type="text"
                                                    placeholder="Eg: Passport Number, Driving License Number etc.."
                                                    class="form-control"
                                                    v-model="form.personal.sidproof" />
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="mobile">Mobile Number*</label>
                                                <input
                                                    id="mobile"
                                                    type="text"
                                                    placeholder="Mobile number*"
                                                    class="form-control"
                                                    v-model="form.personal.mobile"
                                                    :class="{ 'is-invalid': submitted && $v.form.personal.mobile.$error }" />
                                                <div v-if="submitted && $v.form.personal.mobile.$error" class="invalid-feedback">
                                                    <span v-if="!$v.form.personal.mobile.required">Mobile is required</span>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="altmobile">Alternate Number</label>
                                                <input
                                                    id="altmobile"
                                                    type="text"
                                                    placeholder="Alternate Contact number "
                                                    class="form-control"
                                                    v-model="form.personal.altmobile" />
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="email">Email*</label>
                                                <input id="email" type="text" placeholder="Email" class="form-control" v-model="form.personal.email"
                                                    :class="{ 'is-invalid': submitted && $v.form.personal.email.$error }"
                                                    :readonly="user.loggedIn" />
                                                <div v-if="submitted && $v.form.personal.email.$error" class="invalid-feedback">
                                                    <span v-if="!$v.form.personal.email.required">Email is required</span>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-6" Password v-if="user.loggedIn">
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-5" Password v-else>
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label for="password">Password*</label>
                                                <input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    class="form-control"
                                                    v-model="password"
                                                />
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div class="col-sm-1" v-if="user.loggedIn">
                                    </div>
                                    <div class="col-sm-1" v-else>
                                        <fieldset role="group" class="b-form-group form-group">
                                            <div role="group" class>
                                                <label></label>
                                                <span @click="togglePassword">
                                                    <i class="fa fa-eye"></i>
                                                </span>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <strong>Address Information</strong>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="housenumber">House Number*</label>
                                            <input
                                                id="housenumber"
                                                type="text"
                                                placeholder="House Number of the person offering support"
                                                class="form-control"
                                                v-model="form.address.housenumber"
                                                :class="{ 'is-invalid': submitted && $v.form.address.housenumber.$error }" />
                                            <div v-if="submitted && $v.form.address.housenumber.$error" class="invalid-feedback">
                                                <span v-if="!$v.form.address.housenumber.required">House Number is required</span>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="address1">Address Line1*</label>
                                            <input
                                                id="address1"
                                                type="text"
                                                placeholder="Address Line1"
                                                class="form-control"
                                                v-model="form.address.address1"
                                                :class="{ 'is-invalid': submitted && $v.form.address.address1.$error }" />
                                            <div v-if="submitted && $v.form.address.address1.$error" class="invalid-feedback">
                                                <span v-if="!$v.form.address.address1.required">Address Line1 is required</span>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="address2">Address Line2</label>
                                            <input
                                                id="address2"
                                                type="text"
                                                placeholder="Address Line2"
                                                class="form-control"
                                                v-model="form.address.address2" />
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="area">City/Area*</label>
                                            <input
                                                id="area"
                                                type="text"
                                                placeholder="Area"
                                                class="form-control"
                                                v-model="form.address.area"
                                                :class="{ 'is-invalid': submitted && $v.form.address.area.$error }" />
                                            <div v-if="submitted && $v.form.address.area.$error" class="invalid-feedback">
                                                <span v-if="!$v.form.address.area.required">Area/Locality is required</span>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="postcode">Postcode*</label>
                                            <input
                                                id="postcode"
                                                type="text"
                                                placeholder="Postcode"
                                                class="form-control"
                                                v-model="form.address.postcode"
                                                :class="{ 'is-invalid': submitted && $v.form.address.postcode.$error }" />
                                            <div v-if="submitted && $v.form.address.postcode.$error" class="invalid-feedback">
                                                <span v-if="!$v.form.address.postcode.required">Postcode is required</span>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <strong>Availability Status</strong>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="accountstatus">Available for volunteering now?</label>
                                            <input class="mx-4" type="checkbox" v-model="form.accountstatus" id="accountstatus" value="true" unchecked-value="false" checked>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="col-sm-6">
                                    <fieldset role="group" class="b-form-group form-group">
                                        <div role="group" class>
                                            <label for="accountstatus">Are you above 18years ?</label>
                                            <input class="mx-4" type="checkbox" v-model="form.isadult" id="isadult" value="true" unchecked-value="false">
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <strong>Availability Preferences</strong>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <fieldset role="group" class="b-form-group form-group">
                                                <div role="group" class>
                                                    <label for="area">Area of Interest to support</label>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-3"  v-for="(cat,index) in app_settings.support_categories" :key="index">
                                            <fieldset role="group" class="b-form-group form-group">
                                                <div role="group" class>
                                                    <span class="mr-3">{{cat}}</span>
                                                    <input type="checkbox" v-bind:value="cat" v-model="form.availability.support" :id="cat"> 
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="user.loggedIn">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-8">
                                    <div v-if="error" class="alert alert-danger">{{error}}</div>
                                    <div
                                        v-if="status==='submitted'"
                                        class="alert alert-success">Your request submitted successfully.</div>
                                    <div>
                                        <p>By Update, I am agreeing the T&C and sharing all the above information with the support team.</p>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="text-right mr-4">
                                        <button class="btn btn-primary" @click="submitRequest" v-if="!isbutton">Agree & Update Request</button>
                                        <button class="btn btn-secondary" v-else>Submitting...</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-8">
                                    <div v-if="error" class="alert alert-danger">{{error}}</div>
                                    <div
                                        v-if="status==='submitted'"
                                        class="alert alert-success">Your request submitted successfully.</div>
                                    <div>
                                        <p>By submitting, I am agreeing the T&C and sharing all the above information with the support team.</p>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="text-right mr-4">
                                        <button class="btn btn-primary" @click="submitRequest" v-if="!isbutton">Agree & Submit Request</button>
                                        <button class="btn btn-secondary" v-else>Submitting...</button>
                                    </div>
                                </div>
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
import { required, email } from "vuelidate/lib/validators";

const validName = function (name) {
    name=name.trim();
    return (name.length >= 2 && /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name));
}


export default {
    data() {
        return {
            breadcrumbs: [
              { text: "Home", to: "/" },
              { text: "Volunteer details", active: true },
            ],
            form: {
                accountstatus: "",
                isadult: "",
                availability: {
                    support: []
                },
                personal: {
                    firstname: "",
                    lastname: "",
                    idtype: "",
                    idproof: "",
                    sidtype: "",
                    sidproof: "",
                    mobile: "",
                    altmobile: "",
                    email: ""
                },
                address: {
                    housenumber: "",
                    buildname: "",
                    address1: "",
                    address2: "",
                    area: "",
                    postcode: ""
                }
            },
            password: "",
            submitted: false,
            isbutton: false,
            error: null,
            vol: null,
            useralreadyexist: false,
            userrolefound: false,
            status: "new"
        };
    },
    validations: {        
        form: {
            personal: {
                firstname: { required },
                lastname: { required },
                mobile: { required },
                email: { required, email },
                idproof: { required }
            },
            address: {
                housenumber: { required },
                postcode: { required },
                address1: { required },
                area: { required }

            }       
        } 
    },
    computed: {
        ...mapGetters({
            user: "user",
            app_settings: "app_settings"
        })
    },
    created() {
        this.fetchVolunteer();
    },
    methods: {
        submitRequest() {
            this.submitted = "true";
            this.isbutton = true;
            this.$v.$touch()
            if (this.$v.$invalid) {
                this.submitted = "false";
                this.isbutton = false;
                return;
            }
            this.register();
            if (this.user.loggedIn && this.user.data) {
                this.form.user_displayName = this.user.data.displayName || this.user.data.email.toLowerCase();
                this.form.user_email = this.user.data.email.toLowerCase();
            } else {
                this.form.user_displayName = this.form.personal.firstname;
                this.form.user_email = this.form.personal.email.toLowerCase();
            }
            this.form.verified = false;
            this.form.upvotes = [];
            this.form.downvotes = [];
            this.form.timestamp = new Date();
            if (!this.useralreadyexist) {
                var db = firebase.firestore();
                db.collection("can_support")
                    .doc(this.form.user_email.toLowerCase())
                    .set(this.form)
                    .then(docRef => {
                        this.status = "submitted";
                        this.error = null;
                        this.submitted = "false";
                        this.isbutton = false;
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
        },
        fetchVolunteer() {
            if (this.user != null) {
                if (this.user.loggedIn && this.user.data) {
                    this.email = this.user.data.email.toLowerCase();
                    var db = firebase.firestore();
                    let voldata = db.collection('can_support').doc(this.email.toLowerCase())
                    let getDoc = voldata.get()
                        .then(doc => {
                            if (!doc.exists) {
                                console.log('No such document!');
                                this.form.personal.email=this.user.data.email.toLowerCase();
                            } else {
                                console.log('Document data:', doc.data());
                                let vol = doc.data();
                                this.vol = vol;
                                this.populateUserDetails();
                            }
                        })
                        .catch(err => {
                            console.log('Error getting document', err);
                            this.isbutton = false;
                        });
                }
            }
        },
        updateUser() {
            this.$router.push({ path: '/profile' })
        },
        redirect() {
            if (this.user.loggedIn && this.user.data) {
                setTimeout(() => this.$router.push({ path: '/profile' }), 1000);
            } else if (!this.useralreadyexist) {
                setTimeout(() => this.$router.push({ path: '/volunteer-registration-confirmation' }), 1000);
            }
        },
        register() {
            this.useralreadyexist = false;
            let statuscheck = this.user.loggedIn && this.user.data;
            if (!statuscheck) {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.form.personal.email.toLowerCase(), this.password)
                    .then(result => {
                        this.status = "submitted";
                        this.error = null;
                        result.user
                            .updateProfile({
                                displayName: this.form.personal.firstname 
                            })
                            .then(async msg => {
                                const updateUserProfile = firebase.functions().httpsCallable("updateUserProfileAll");
                                await updateUserProfile({
                                    username: this.form.personal.email.toLowerCase(),
                                    fullname: this.form.personal.firstname || "",
                                    isavailablevolunteer: this.form.accountstatus,
                                    firstname: this.form.personal.firstname,
                                    lastname: this.form.personal.lastname
                                })
                                this.$store.dispatch("fetchUser", result.user);
                            }).catch((ex) => {
                                console.error(ex);
                                this.useralreadyexist = true;
                                this.submitted = false;
                                this.isbutton = false;
                            });
                    })
                    .catch(err => {
                        this.error = err.message;
                        this.status = "error";
                        this.useralreadyexist = true;
                        this.submitted = false;
                        this.isbutton = false;
                    });
            }
        },
        togglePassword() {
            var x = document.getElementById("password");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        },
        populateUserDetails() {
            let vol = this.vol;
            this.form.personal.firstname = vol.personal.firstname;
            this.form.personal.lastname = vol.personal.lastname;
            this.form.personal.idtype = vol.personal.idtype;
            this.form.personal.idproof = vol.personal.idproof;
            this.form.personal.sidtype = vol.personal.sidtype;
            this.form.personal.sidproof = vol.personal.sidproof;
            this.form.personal.mobile = vol.personal.mobile;
            this.form.personal.altmobile = vol.personal.altmobile;
            if(vol.personal.email != "") {
                this.form.personal.email = vol.personal.email.toLowerCase();
            }     
            this.form.address.housenumber = vol.address.housenumber;
            this.form.address.buildname = vol.address.buildname;
            this.form.address.address1 = vol.address.address1;
            this.form.address.address2 = vol.address.address2;
            this.form.address.area = vol.address.area;
            this.form.address.postcode = vol.address.postcode;
            this.form.accountstatus = vol.accountstatus;
            this.form.isadult = vol.isadult;
            this.form.availability.support = vol.availability.support;
        },
        updatevolprofile() {
            const updateUserProfile = firebase.functions().httpsCallable("updateUserProfileAll");
            updateUserProfile({
                username: this.form.personal.email.toLowerCase(),
                fullname: this.form.personal.firstname || "",
                isavailablevolunteer: this.form.accountstatus,
                firstname: this.form.personal.firstname,
                lastname: this.form.personal.lastname,
                isadult: this.form.isadult
            }).then(msg => {
                if (this.form) {
                    this.status = "submitted";
                    this.error = null;
                    setTimeout(() => {
                        this.status = "new";
                        this.error = null;
                    }, 5 * 1000);
                } else {
                    this.status = "error";
                    this.error = "error";
                    setTimeout(() => {
                        this.status = "new";
                        this.error = null;
                    }, 5 * 1000);
                }
            })
            .catch(() => {});
        }
    }
};
</script>        

<style>
.marginPadding {
   margin-bottom: 1.79rem !important;
}
.form-group-cat {
    margin-bottom: 0.5rem !important;
}
</style>
