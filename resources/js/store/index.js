import { createStore } from 'vuex'; // Updated import
import services from './modules/services.js';
import appointments from './modules/appointments.js';
import backendServices from './modules/backend/services.js';
import backendAppointments from './modules/backend/appointments.js';
import auth from './modules/auth.js'; // Import your auth module
import reviews from './modules/reviews.js'; // Import your auth module
import contentBlock from './modules/contentBlock.js';
import backendContentBlock from './modules/backend/backendContentBlock.js';
import patients from './modules/backend/patients.js';

const store = createStore({ // Use createStore for Vue 3
  modules: {
    auth,
    services,
    reviews,
    appointments,
    backendServices, // Add backend services module
    backendAppointments, // Add backend appointments module
    contentBlock,
    backendContentBlock,
    patients,
  },
});

export default store;
