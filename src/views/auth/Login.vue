<template>
  <div class="container mt-4">
    <div class="row" v-if="error || (status==='submitted')">
      <div class="col-sm-12">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <div v-if="status==='submitted'" class="alert alert-success">Registration done successfully</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">Login with social credentials</div>
          <div class="card-body text-center">
            <a class="btn btn-primary text-white p-2 m-2" @click="signInWithGoogle">
              <i class="fa fa-google"></i> Sign in With Google
            </a>
            <a class="btn btn-primary text-white m-2 p-2" @click="signInWithFacebook">
              <i class="fa fa-facebook"></i> Sign in With Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header">Login with username & password</div>
          <div class="card-body">
            <div>
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="loginform.email"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="loginform.password"
                  />
                </div>
              </div>
              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary" @click="login">Login</button>
                </div>
              </div>
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header">Register new account</div>
          <div class="card-body">
            <div>
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right">Full Name</label>
                <div class="col-md-6">
                  <input
                    id="registername"
                    type="name"
                    class="form-control"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="form.name"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
                <div class="col-md-6">
                  <input
                    id="registeremail"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                <div class="col-md-6">
                  <input
                    id="registerpassword"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                </div>
                <div class="col-md-1">
                  <span @click="togglePassword">
                    <i class="fa fa-eye"></i>
                  </span>
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <a @click="register" class="btn btn-primary text-white">Register</a>
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
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      loginform: {
        email: "",
        password: ""
      },
      status: "new",
      error: null
    };
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    login() {
      const auth = firebase
        .auth()
        .signInWithEmailAndPassword(
          this.loginform.email,
          this.loginform.password
        );
      auth
        .then(async data => {
          if (data && data.user) {
            const updateUserProfile = firebase.functions().httpsCallable("updateUserProfile");
            updateUserProfile({
              username: data.user.email,
              uid: data.user.uid,
              fullname : data.user.displayName ||  data.user.fullname || "-",
              firstname : data.user.firstname || '',
              lastname : data.user.lastname || '',
              last_login_time : new Date()
            });
            this.$store.dispatch("fetchUser", data.user);
            this.$router.replace({ name: "profile" });
          } else {
            this.error = "Unknown error";
          }
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const auth = firebase.auth().signInWithPopup(provider);
      auth
        .then(result => {
          if (result && result.user) {
            const updateUserProfile = firebase.functions().httpsCallable("updateUserProfile");
            updateUserProfile({
              username: result.user.email,
              uid: result.user.uid,
              fullname : result.user.displayName || result.user.fullname || "",
              firstname : result.user.firstname || '',
              lastname : result.user.lastname || '',
              last_login_time : new Date()
            })            
            this.$store.dispatch("fetchUser", result.user);
            this.$router.replace({ name: "profile" });
          }
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    signInWithFacebook() {
      const provider =new firebase.auth.FacebookAuthProvider();      
      const auth = firebase.auth().signInWithPopup(provider);
      auth
        .then(result => {
          if (result && result.user) {
            const updateUserProfile = firebase.functions().httpsCallable("updateUserProfile");
            updateUserProfile({
              username: result.user.email,
              uid: result.user.uid,
              fullname : result.user.displayName || result.user.fullname || "",
              firstname : result.user.firstname || '',
              lastname : result.user.lastname || '',
              last_login_time : new Date()
            })            
            this.$store.dispatch("fetchUser", result.user);
            this.$router.replace({ name: "profile" });
          }
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    togglePassword() {
      var x = document.getElementById("registerpassword");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(result => {
          this.status = "submitted";
          this.error = null;
          result.user
            .updateProfile({
              fullname : this.form.name || result.user.displayName || result.user.fullname || "",
              firstname : this.form.name ? this.form.name.split(" ")[0] : '' ,
              lastname : this.form.name ? this.form.name.split(" ").filter((item,index)=> index !==0).join(" ") : '' ,
              displayName: this.form.name || "User"
            })
            .then(msg => {
              const updateUserProfile = firebase.functions().httpsCallable("updateUserProfile");
              updateUserProfile({
                username: this.form.email,
                uid: result.user.uid,
                fullname : this.form.name || result.user.displayName || result.user.fullname || "",
                firstname : this.form.name ? this.form.name.split(" ")[0] : '' ,
                lastname : this.form.name ? this.form.name.split(" ").filter((item,index)=> index !==0).join(" ") : '' ,
                last_login_time : new Date()
              })
              this.$store.dispatch("fetchUser", result.user);
              this.$router.replace({ name: "profile" });
            }).catch((ex)=>{
              console.error(ex);
            });
        })
        .catch(err => {
          this.error = err.message;
          this.status = "error";
        });
    }
  }
};
</script>