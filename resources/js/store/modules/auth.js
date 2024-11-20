import axios from '../../utils/axios.js';

const state = {
  user: null,
  token: localStorage.getItem('user-token') || '',
  authChecked: false, // Loading flag for authentication check
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_AUTH_CHECKED(state, value) {
    state.authChecked = value;
  },
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/api/login', credentials);
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem('user-token', token);
      localStorage.setItem('user-role', user.role);

      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login failed:', error.response.data);
      throw error.response.data;
    }
  },

  async register({ dispatch }, userData) {
    try {
      const response = await axios.post('/api/register', userData);
      console.log('Registration successful:', response.data);

      const loginData = {
        email: userData.email,
        password: userData.password,
      };
      await dispatch('login', loginData); // Auto-login after registration
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      throw error.response.data;
    }
  },

  async logout({ commit }) {
    console.log('Logging out...');
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-role');

    commit('SET_TOKEN', '');
    commit('SET_USER', null);
    console.log('Logout successful');
  },

async checkAuth({ commit }) {
  const token = localStorage.getItem('user-token');
  commit('SET_AUTH_CHECKED', false); // Start loading state

  if (token) {
    commit('SET_TOKEN', token);
    try {
      const response = await axios.get('/api/user');
      commit('SET_USER', response.data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Clear token and user role if user data can't be fetched
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-role');
      commit('SET_USER', null);  // Clear user state
      commit('SET_TOKEN', '');   // Clear token
    }
  } else {
    // No token, clear user state and token
    commit('SET_USER', null);  
    commit('SET_TOKEN', '');   
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-role');
  }

  commit('SET_AUTH_CHECKED', true);  // Stop loading state
},



  async resetPassword({ commit }, { email, password, token }) {
    try {
      const response = await axios.post('/api/password/reset', {
        email,
        password,
        password_confirmation: password,
        token,
      });
      console.log('Password reset successful:', response.data);
      localStorage.setItem('resetpassword', 'true');
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error.response.data);
      throw error.response.data;
    }
  },

  async sendPasswordResetLink({ commit }, { email }) {
    try {
      const response = await axios.post('/api/password/email', { email });
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  async updateUser({ commit, state }, userData) {
    try {
      const response = await axios.post('/api/user', userData);
      const updatedUser = response.data.user;
      commit('SET_USER', updatedUser);
      console.log('Profile updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error.response.data);
      throw error.response.data;
    }
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token, // Check both token and user
  user: (state) => state.user,
  authChecked: (state) => state.authChecked,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
