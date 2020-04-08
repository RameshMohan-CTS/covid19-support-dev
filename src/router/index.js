import Vue from 'vue'
import VueRouter from 'vue-router'
const DefaultContainer = () => import('@/containers/DefaultContainer');
const NotFound = () => import('@/views/NotFound')

import Welcome from '../views/Welcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/welcome',
    component: DefaultContainer,
    children: [
      {
        path: '',
        name: 'Home',
        redirect: '/welcome'
      },
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "auth" */ '../views/auth/Login.vue')
      },
      {
        path: 'signout',
        name: 'signout',
        component: () => import(/* webpackChunkName: "auth" */ '../views/auth/Logout.vue')
      },
      {
        path: 'register',
        name: 'register',
        redirect: '/login'
      },
      {
        path: 'about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/public/About.vue')
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import(/* webpackChunkName: "contact" */ '../views/public/ContactUs.vue')
      },
      {
        path: 'contact/moderator',
        name: 'contact-moderator',
        component: () => import(/* webpackChunkName: "contact" */ '../views/messages/MessageModerator.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/Profile.vue')
      },
      {
        path: 'need/support',
        name: 'request-support',
        component: () => import(/* webpackChunkName: "suppport" */ '../views/help/RequestSupport.vue')
      },
      {
        path: 'can/support',
        name: 'offer-support',
        component: () => import(/* webpackChunkName: "suppport" */ '../views/help/OfferSupport.vue')
      },
      {
        path: `volunteer-registration-confirmation`,
        name: `volunteer-registration-confirmation`,
        component: () => import(/* webpackChunkName: "suppport" */ '../views/public/VolunteerRegisterConfirmation.vue')
      },
      {
        path: 'support-requests',
        name: 'support-requests',
        redirect: '/support-requests/bystatus/open'
      },
      {
        path: 'support-requests/bystatus/:status',
        name: 'support-requests-bystatus',
        component: () => import(/* webpackChunkName: "support" */ '../views/help/SupportRequests.vue')
      },
      {
        path: 'support-request/:supportrequestid',
        name: 'supportrequest',
        component: () => import(/* webpackChunkName: "support" */ '../views/help/SupportRequest.vue')
      },
      {
        path: 'track',
        name: 'track-request',
        component: () => import(/* webpackChunkName: "track" */ '../views/help/TrackRequest.vue')
      },
      {
        path: 'volunteers',
        name: 'volunteers',
        component: () => import(/* webpackChunkName: "volunteers" */ '../views/help/Volunteers.vue')
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import(/* webpackChunkName: "groups" */ '../views/groups/Groups.vue')
      },
      {
        path: 'group/:groupid',
        name: 'group',
        component: () => import(/* webpackChunkName: "groups" */ '../views/groups/Group.vue')
      },
      {
        path: 'groups/create',
        name: 'groups-create',
        component: () => import(/* webpackChunkName: "groups" */ '../views/groups/Create.vue')
      },
      {
        path: 'donations',
        name: 'donations',
        component: () => import(/* webpackChunkName: "donate" */ '../views/help/Donations.vue')
      },
      {
        path: 'donations',
        name: 'donations',
        redirect: '/donations/bystatus/open'
      },
      {
        path: 'donations/bystatus/:status',
        name: 'donations-bystatus',
        component: () => import(/* webpackChunkName: "donate" */ '../views/help/Donations.vue')
      },      
      {
        path: 'donation/:donationid',
        name: 'donation',
        component: () => import(/* webpackChunkName: "donate" */ '../views/help/Donation.vue')
      },
      {
        path: 'donate',
        name: 'donate',
        component: () => import(/* webpackChunkName: "donate" */ '../views/help/Donate.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Admin.vue')
      },
      {
        path: 'admin/appsettings',
        name: 'admin-appsettings',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/AppSettings.vue')
      },
      {
        path: 'users/manage',
        name: 'manageusers',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/ManageUsers.vue')
      },
      {
        path: 'admin/messages',
        name: 'messageslist',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Messages.vue')
      },
      {
        path: 'sorry',
        name: 'sorry',
        component: NotFound
      },
      { 
        path: '*', 
        redirect: '/sorry' 
      }    
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
