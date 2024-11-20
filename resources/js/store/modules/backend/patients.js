import axios from '../../../utils/axios.js';

const state = {
  patients: [],
  patient: {
    id: null,
    name: '',
    email: '',
    phone: '',
    status: '',
    is_new_user: false,
    payment_status: '',
  },
};

const mutations = {
  SET_PATIENTS(state, patients) {
    state.patients = patients;
  },
  SET_PATIENT(state, patient) {
    state.patient = { ...patient }; // Spread the patient object to ensure a fresh copy
  },
  UPDATE_PATIENT(state, updatedPatient) {
    const index = state.patients.findIndex((patient) => patient.id === updatedPatient.id);
    if (index !== -1) {
      state.patients.splice(index, 1, { ...updatedPatient });
    }
  },
};

const actions = {
  async fetchPatients({ commit }) {
    try {
      const response = await axios.get('/api/patients');
      console.log('patients',response.data);
      commit('SET_PATIENTS', response.data);
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  },
  async fetchPatientById({ commit }, patientId) {
    try {
      const response = await axios.get(`/api/patients/${patientId}`);
      commit('SET_PATIENT', response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  },
  async updatePatient({ dispatch }, { id, data }) {
    try {
      await axios.post(`/api/patients/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          _method: 'PUT', // Specify that the intended method is PUT
        },
      });
      dispatch('fetchPatients');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  },
  async deletePatient({ dispatch }, patientId) {
    try {
      await axios.delete(`/api/patients/${patientId}`);
      dispatch('fetchPatients');
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  },
};

const getters = {
  allPatients: (state) => state.patients,
  currentPatient: (state) => state.patient,
};

export default {
  namespaced: true, // Ensure the module is namespaced
  state,
  mutations,
  actions,
  getters,
};
