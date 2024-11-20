import axios from '../../utils/axios.js';

const state = {
  reviews: [],
  review: null,
  latestFeaturedReviews: [],  // New state for latest featured reviews
};

const mutations = {
  SET_REVIEWS(state, reviews) {
    state.reviews = reviews;
  },
  SET_REVIEW(state, review) {
    state.review = review;
  },
  SET_LATEST_FEATURED_REVIEWS(state, reviews) {
    state.latestFeaturedReviews = reviews;  // Mutate latest featured reviews
  },
};

const actions = {
  // Fetch reviews for a service
  async fetchReviews({ commit }, serviceId) {
    try {
      const response = await axios.get(`/api/reviews?service_id=${serviceId}`);
      commit('SET_REVIEWS', response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  },

  async addReview({ commit }, formData) {
    try {
      const response = await axios.post('/api/reviews', formData);
      commit('SET_REVIEW', response.data);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  },

  // Toggle the featured status of a review (admin only)
  async toggleFeatured({ commit, state }, reviewId) {
    try {
      const response = await axios.post(`/api/reviews/${reviewId}/toggle-featured`);
      const updatedReview = response.data;

      const reviews = state.reviews.map((review) =>
        review.id === reviewId ? { ...review, featured: updatedReview.featured } : review
      );
      commit('SET_REVIEWS', reviews);
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  },

  async deleteReview({ commit }, reviewId) {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      commit('removeReview', reviewId); // Remove review from state after deletion
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  },

  // Fetch the latest 3 featured reviews
  async fetchLatestFeaturedReviews({ commit }) {
    try {
      const response = await axios.get('/api/latest-featured-reviews');
      commit('SET_LATEST_FEATURED_REVIEWS', response.data);  // Store the fetched reviews
    } catch (error) {
      console.error('Error fetching latest featured reviews:', error);
    }
  },
};

const getters = {
  allReviews: (state) => state.reviews,
  review: (state) => state.review,
  latestFeaturedReviews: (state) => state.latestFeaturedReviews,  // Getter for latest featured reviews
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
