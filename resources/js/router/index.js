import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js';

import Home from '../views/Home.vue';
import Appointment from '../views/Appointment.vue';
import ConfirmBooking from '../components/ConfirmBooking.vue';
import MyAppointments from '../components/MyAppointments.vue';
import ResetPassword from '../components/ResetPassword.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Review from '../components/Review.vue';
import ReviewsList from '../components/backend/ReviewsList.vue';

import Profile from '../components/Profile.vue';
import AppointmentSummary from '../components/AppointmentSummary.vue'; // Import the new component
import AdminLayout from '../views/backend/AdminLayout.vue';
import PatientLayout from '../views/PatientLayout.vue';
import Dashboard from '../views/backend/Dashboard.vue';
import Appointments from '../views/backend/Appointments.vue';
import Services from '../views/backend/Services.vue'; 
import AddService from '../components/backend/services/AddService.vue'; 
import EditService from '../components/backend/services/EditService.vue'; 
import AppointmentDetail from '../components/backend/AppointmentDetail.vue'; // Import the new component

import Patients from '../components/backend/Patients.vue';

import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';

// Import your new components
import HeroSectionForm from '../components/backend/customize/HeroSectionForm.vue';
import ConsultationSectionForm from '../components/backend/customize/ConsultationSectionForm.vue';
import AboutSectionForm from '../components/backend/customize/AboutSectionForm.vue';
import LogoSectionForm from '../components/backend/customize/LogoSectionForm.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: Appointment,
  },

 {
    path: '/appointment-summary/:id',  // New route for Appointment Summary
    name: 'AppointmentSummary',
    component: AppointmentSummary,
    props: true,  // Pass route params as props to the component
  },
{
  path: '/password/reset/:token', // :token will capture the token in the URL
  name: 'ResetPassword',
  component: ResetPassword, // The Vue component you created for the reset password form
  props: true, // This allows you to pass the route params to the component
},
{
  path: '/forgotpassword', // :token will capture the token in the URL
  name: 'ForgotPassword',
  component: ForgotPassword, // The Vue component you created for the reset password form
  props: true, // This allows you to pass the route params to the component
},

{
  path: '/patientdashboard',
  component: PatientLayout,
  meta: { requiresAuth: true },
  children: [
    {
      path: 'myappointments',
      name: 'MyAppointments',
      component: MyAppointments,
    },
    {
  path: '/confirm-booking/:id',
  name: 'ConfirmBooking',
  component: ConfirmBooking,
  props: true,  // Pass route params as props to the component
},
{
      path: 'profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: 'reviews',
      name: 'review',
      component: Review,
    },


   
  ]
},


  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'appointments',
        name: 'Appointments',
        component: Appointments,
      },
      {
        path: 'services',
        name: 'ServiceList',
        component: Services,
      },
         {
        path: 'patients',
        name: 'Patients',
        component: Patients,
      },
      {
      path: 'appointment/:id', // Dynamic route to get the appointment ID
      name: 'AppointmentDetail',
      component: AppointmentDetail,
      props: true,  // Pass the route params as props to the component
    },
      {
        path: 'services/add',
        name: 'AddService',
        component: AddService,
      },
      {
        path: 'services/edit/:id',
        name: 'EditService',
        component: EditService,
      },
      {
        path: 'customize/hero', // Route for Hero Section
        name: 'HeroSectionForm',
        component: HeroSectionForm,
      },
      {
        path: 'customize/consultation', // Route for Consultation Section
        name: 'ConsultationSectionForm',
        component: ConsultationSectionForm,
      },
      {
        path: 'customize/about', // Route for About Section
        name: 'AboutSectionForm',
        component: AboutSectionForm,
      },
         {
        path: 'customize/logo', // Route for About Section
        name: 'LogoSectionForm',
        component: LogoSectionForm,
      },
       {
    path: 'reviews',
    name: 'ReviewsList',
    component: ReviewsList
  },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication and admin role check
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const role = localStorage.getItem('user-role');
  console.log('role', role);

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/login' });
  } else if (to.matched.some(record => record.meta.requiresAdmin) && role !== 'admin') {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
