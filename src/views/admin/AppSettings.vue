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
          <div class="col-sm-12">
              <h4 class="text-primary mb-4">Application Settings</h4>
              <div v-if="error" class="alert alert-danger">{{error}}</div>
              <div v-if="status==='submitted'" class="alert alert-success">Settings saved successfully.</div>
              <div class="card mt-4">
                  <div class="card-header">Application Title</div>
                  <div class="card-body">
                      <div class="row">
                        <div class="col-sm-12">
                            <fieldset role="group" class="b-form-group form-group">
                                <div role="group" class>
                                <input
                                    id="applicationtitle"
                                    type="text"
                                    placeholder="Application Title"
                                    class="form-control"
                                    v-model="app_settings.app_title"
                                />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                  </div>
              </div>
              <div class="card">
                  <div class="card-header">Contact US page</div>
                  <div class="card-body">
                      <div class="row">
                        <div class="col-sm-6">
                            <fieldset role="group" class="b-form-group form-group">
                                <div role="group" class>
                                <textarea
                                    id="page_contactus"
                                    type="text"
                                    placeholder="Contact Us Page"
                                    class="form-control"
                                    v-model="app_settings.page_contactus"
                                    rows="10"
                                ></textarea>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-sm-6" style="max-height:200px; overflow-y:scroll;">
                            <MarkdownDisplay :text="app_settings.page_contactus" />
                        </div>
                    </div>
                  </div>
              </div>
               <div class="card">                  
                  <div class="card-body">
                      <div class="row">
                        <div class="col-sm-6">
                            <div class="card-header">Support Categories</div>
                                <div v-for="(support_category,index) in app_settings.support_categories" :key="index" class="my-2">
                                    <div class="row">
                                        <div class="col-sm-8">
                                            <template v-if="app_settings.support_categories[index]==='General'|| app_settings.support_categories[index]==='Others'"> <input type="text" disabled class="form-control form-inline" v-model="app_settings.support_categories[index]" /></template>
                                            <template v-else> <input type="text" class="form-control form-inline" v-model="app_settings.support_categories[index]" /></template>
                                        </div>
                                        <div class="col-sm-4">
                                            <i  v-if="app_settings.support_categories[index] !== 'Others'" class="fa fa-plus btn-primary btn mr-2" @click="insertSupportCategory(index)"></i>
                                            <template v-if="app_settings.support_categories[index]==='General'|| app_settings.support_categories[index]==='Others'">
                                            </template>
                                            <template v-else><i class="fa fa-trash btn-danger btn mr-2" @click="removeSupportCategory(index)"></i></template>
                                        </div>
                                    </div>
                                </div>
                            <button class="btn btn-success" @click="addSupportCategory">Add category</button>
                        </div>
                        <div class="col-sm-6">
                            <div class="card-header">Donation Categories</div>
                            <div v-for="(donation_category,index) in app_settings.donation_categories" :key="index" class="my-2">
                                <div class="row">
                                    <div class="col-sm-8">                                        
                                        <template> <input type="text" class="form-control form-inline" v-model="app_settings.donation_categories[index]" /></template>
                                    </div>
                                    <div class="col-sm-4">
                                        <i class="fa fa-plus btn-primary btn mr-2" @click="insertDonationCategory(index)"></i>                                        
                                        <template><i class="fa fa-trash btn-danger btn mr-2" @click="removeDonationCategory(index)"></i></template>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-success" @click="addDonationCategory">Add category</button>
                        </div>
                    </div>
                  </div>
              </div>
              <div class="row my-4">
                  <div class="col-sm-12 text-center">
                      <button class="btn btn-primary" @click="saveSettings" >Update Settings</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateApplicationSettings } from "@/app/backend.js";
import MarkdownDisplay from '@/components/MarkdownDisplay';
Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};
export default {
    components: {
        MarkdownDisplay
    },
    data(){
        return {
            breadcrumbs : [
                { text : "Home", to : "/" },
                { text : "Admin", to : "/admin" },
                { text : "Application Settings", active : true }
            ],
            error: "",
            status: ""
        }
    },
    computed: {
        ...mapGetters({
            user: "user",
            app_settings: "app_settings"
        })
    },
    methods: {
        insertSupportCategory(index){
            this.app_settings.support_categories.insert(index+1,"")
        },
        removeSupportCategory(index){
            this.app_settings.support_categories.splice(index,1);
        },
        addSupportCategory(){
            this.app_settings.support_categories = this.app_settings.support_categories || [];
            this.app_settings.support_categories.push("");
        },
        insertDonationCategory(index){
            this.app_settings.donation_categories.insert(index+1,"")
        },
        removeDonationCategory(index){
            this.app_settings.donation_categories.splice(index,1);
        },
        addDonationCategory(){
            this.app_settings.donation_categories = this.app_settings.donation_categories || [];
            this.app_settings.donation_categories.push("");
        },
        async saveSettings(){
            if(this.user && this.user.data && this.user.data.admin){
                try{
                    let res = await updateApplicationSettings(this.app_settings, this.user.data.email);
                    this.error = "";
                    this.status = "submitted"
                } catch(ex){
                    this.error = "Failed to update the settings";
                    this.status = "";
                }
            } else {
                this.error = "You don't have permissions to edit the settings";
                this.status = "";
                this.$router.replace({ name: "login" });
            }

            window.scroll(0,0);
        }
    }

}
</script>