
window._ = require('lodash');
require('datejs');
// Initialize Firebase
let config;
if(process.env.NODE_ENV !== 'production') {
  console.log(process.env);
  config = {
    apiKey: "AIzaSyAcjFtRHmXguek060FhPql3KH_--AXoEjs",
    authDomain: "forloop-74a2a.firebaseapp.com",
    databaseURL: "https://forloop-74a2a.firebaseio.com",
    storageBucket: "forloop-74a2a.appspot.com",
    messagingSenderId: "296148842604"
  };

}else {
  console.log(process.env);
  config = {
    apiKey: "AIzaSyCK_-UkPvs-xjqMriFfntP6xLrCDS3sUqw",
    authDomain: "forloop-be249.firebaseapp.com",
    databaseURL: "https://forloop-be249.firebaseio.com",
    storageBucket: "forloop-be249.appspot.com",
    messagingSenderId: "332051163114"
  };
}

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

window.Vue = require('vue');
const vueResource   = require('vue-resource');
const vueRouter     = require('vue-router');
const vueFire       = require('vuefire');
const firebase      = require('firebase');
const bootstrapVue  = require('bootstrap-vue');
window.firebase     = firebase;
Vue.use(vueResource);
Vue.use(vueRouter);
Vue.use(vueFire);


firebase.initializeApp(config);
firebase.initializeApp(config, 'AdminApp');
firebase.initializeApp(config, 'AdminCreateApp');

const authState = function () {
  return new Promise((resolve, reject) => {
          firebase.app('AdminApp').auth().onAuthStateChanged(user => {
            if(user && user.email){
              resolve(user);
            }else{
              reject(new Error("No User"));
            }
          });
  });
}

const App           = require('./components/AdminApp.vue');
const AdminArea     = require('./components/admin/AdminArea.vue');
const Dashboard     = require('./components/admin/Dashboard.vue');
const Subscribers   = require('./components/admin/Subscribers.vue');
const ManageUsers   = require('./components/admin/users/ManageUsers.vue');
const UserProfile   = require('./components/admin/users/Profile.vue');
const ViewUsers     = require('./components/admin/users/ViewUsers.vue');
const Sponsors      = require('./components/admin/sponsors/Sponsors.vue');
const ManageEvents  = require('./components/admin/events/ManageEvents.vue');
const CreateEvent   = require('./components/admin/events/CreateEvent.vue');
const EventDetails  = require('./components/admin/events/EventDetails.vue');
const Events        = require('./components/admin/events/Events.vue');
const ManagePages   = require('./components/admin/pages/ManagePages.vue');
const AboutPage     = require('./components/admin/pages/About.vue');
const MembersPage   = require('./components/admin/pages/Members.vue');
const TeamPage      = require('./components/admin/pages/Team.vue');
const Login         = require('./components/admin/Login.vue');

//Define admin application routes
const routes = [
  { path: '/', component: AdminArea,
    children: [
      {
        path: 'login', component: Login
      },
      {
        path: 'dashboard', component: Dashboard,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'subscribers', component: Subscribers,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'events', component: ManageEvents,
        children: [
          {
            path: 'create', component: CreateEvent,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'edit/:slug', component: EventDetails,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: '', component: Events,
            meta: {
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: 'sponsors', component: Sponsors,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'pages', component: ManagePages,
        children: [
          {
            path: 'about', component: AboutPage,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'team', component: TeamPage,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'members', component: MembersPage,
            meta: {
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: 'users', component: ManageUsers,
        children: [
          {
            path: 'manage', component: ViewUsers,
            meta: {
              requiresAuth: true,
              requiresRoles: ['superadmin']
            }
          }
        ]
      },
      {
        path: '', redirect: 'dashboard'
      }
    ]
  }
]

const router = new vueRouter({
  mode: 'history',
  base: '/admin',
  routes
});
router.beforeEach((to, from, next) => {

  if(!to.meta.requiresAuth){
    next()
  }
  authState().then(user => next(), () => next({path: '/login'}));
});

new Vue({
  el: '#app',
  router,
  ...App
});

/**
 * We'll register a HTTP interceptor to attach the "CSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */

Vue.http.interceptors.push((request, next) => {
    request.headers.set('X-CSRF-TOKEN', Laravel.csrfToken);

    next();
});

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
