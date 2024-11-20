import axios from '../../../utils/axios.js';

const state = {
  appointments: [],
  appointmentDetail: null, // Added to store the fetched appointment detail
};

const mutations = {
  SET_APPOINTMENTS(state, appointments) {
    state.appointments = appointments;
  },
  SET_APPOINTMENT_DETAIL(state, appointment) {
    state.appointmentDetail = appointment; // Set the specific appointment detail
  },
  UPDATE_APPOINTMENT_STATUS(state, { appointmentId, status }) {
    const appointment = state.appointments.find(app => app.id === appointmentId);
    if (appointment) {
      appointment.status = status; // Update the status in the local state
    }
  },
  REMOVE_APPOINTMENT(state, appointmentId) {
    state.appointments = state.appointments.filter(app => app.id !== appointmentId); // Remove the appointment from the state
  },
};

const actions = {
  async fetchAppointments({ commit }) {
    try {
      const response = await axios.get('/api/appointments');
      commit('SET_APPOINTMENTS', response.data);
      return response.data; // Return the data (success response)

    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  },
  
async fetchAppointmentBackendById({ commit }, appointmentId) {
    try {
      const response = await axios.get(`/api/appointments/${appointmentId}`);
      commit('SET_APPOINTMENT_DETAIL', response.data); // Store the specific appointment details
      return response.data; // Return the data (success response)
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
      throw error; // Return the error if any occurs
    }
  },
  
  async changeAppointmentStatus({ commit }, { appointmentId, newStatus }) {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: newStatus });
      commit('UPDATE_APPOINTMENT_STATUS', { appointmentId, status: newStatus }); // Update local state
    } catch (error) {
      console.error('Error changing appointment status:', error);
    }
  },

  async deleteAppointment({ commit }, appointmentId) {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`);
      commit('REMOVE_APPOINTMENT', appointmentId); // Update the state to remove the appointment
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  },
};

const getters = {
  allAppointments: (state) => state.appointments,
  appointmentDetail: (state) => state.appointmentDetail, // Getter for appointment details
};

export default {
  state,
  mutations,
  actions,
  getters,
};
