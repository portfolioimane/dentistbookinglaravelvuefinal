<template>
  <div class="review-form-container">
    <h3 class="form-title">Leave a Review</h3>

    <!-- Prompt for patient -->
    <div class="prompt-message">
      <p>Please tell us about your experience in detail so we can improve our service!</p>
    </div>

    <form @submit.prevent="submitReview" class="review-form">
      <!-- Avatar Upload -->
      <div class="form-group">
        <label for="avatar" class="form-label">Upload Avatar</label>
        <input 
          type="file" 
          id="avatar" 
          @change="previewAvatar" 
          accept="image/*" 
          class="form-input-file"
        />
        <!-- Avatar Preview -->
        <div v-if="avatarPreview" class="avatar-preview">
          <img :src="avatarPreview" alt="Avatar Preview" class="avatar-img" />
        </div>
      </div>

      <!-- Service Selection -->
      <div class="form-group">
        <label for="service" class="form-label">Select Service</label>
        <select v-model="review.serviceId" id="service" required class="form-select">
          <option value="" disabled>Select a service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>

      <!-- Rating Selection with Stars -->
      <div class="form-group">
        <label for="stars" class="form-label">Rating (1 to 5)</label>
        <div class="star-rating">
          <span
            v-for="star in 5"
            :key="star"
            :class="{'filled': star <= review.stars, 'empty': star > review.stars}"
            @click="setRating(star)"
            class="star"
          >
            ★
          </span>
        </div>
      </div>

      <!-- Review Content -->
      <div class="form-group">
        <label for="content" class="form-label">Your Review</label>
        <textarea 
          v-model="review.content" 
          id="content" 
          rows="4" 
          placeholder="Write your review here..." 
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-group">
        <button type="submit" class="btn-submit">Submit Review</button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';  // Import SweetAlert

export default {
  data() {
    return {
      review: {
        serviceId: '', // Store the selected service ID
        stars: 5, // Default star rating
        content: '',
        avatar: null, // Store the avatar file
      },
      avatarPreview: null, // Store avatar preview URL
    };
  },
  computed: {
    // Get services from Vuex store
    services() {
      return this.$store.getters['services/allServices'];
    },
  },
  created() {
    // Fetch services when component is created
    this.fetchServices();
  },
  methods: {
    async fetchServices() {
      try {
        // Fetch services via Vuex action
        await this.$store.dispatch('services/fetchServices');
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    setRating(star) {
      this.review.stars = star; // Update stars when a star is clicked
    },
    previewAvatar(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image') && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        this.review.avatar = file; // Store the avatar file
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarPreview = e.target.result; // Set the avatar preview URL
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file (JPG, PNG, or GIF).');
      }
    },
    async submitReview() {
      // Ensure avatar is an image
      if (this.review.avatar && !['image/jpeg', 'image/png', 'image/gif'].includes(this.review.avatar.type)) {
        alert('Please upload a valid image file (JPG, PNG, or GIF).');
        return;
      }

      // Ensure that a service is selected before submitting
      if (!this.review.serviceId) {
        alert('Please select a service');
        return;
      }

      // Prepare the form data to send to the API
      const formData = new FormData();
      formData.append('serviceId', this.review.serviceId);
      formData.append('stars', this.review.stars);
      formData.append('content', this.review.content);

      if (this.review.avatar) {
        formData.append('avatar', this.review.avatar); // Append avatar image file
      }

      // Dispatch the review data to Vuex action
      try {
        await this.$store.dispatch('reviews/addReview', formData);

        // Trigger success message with SweetAlert
        Swal.fire({
          title: 'Thank you for your review!',
          text: 'We appreciate your feedback and will use it to improve our services.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Optionally reset the form
        this.review = { serviceId: '', stars: 5, content: '', avatar: null };
        this.avatarPreview = null; // Reset avatar preview
      } catch (error) {
        console.error('Error submitting review:', error);
        // Optionally display an error SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'There was an issue submitting your review. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
  },
};
</script>

<style scoped>
.review-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.prompt-message {
  margin-bottom: 20px;
  font-size: 1rem;
  color: #555;
  text-align: center;
}

.review-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

.form-select, .form-textarea, .form-input-file {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
}

.form-select:focus, .form-textarea:focus, .form-input-file:focus {
  outline: none;
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
}

.star-rating {
  display: flex;
  justify-content: start;
  gap: 5px;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: #ddd; /* Empty star color */
}

.star.filled {
  color: #f39c12; /* Filled star color */
}

.star.empty {
  color: #ddd; /* Empty star color */
}

.btn-submit {
  background-color: #3498db;
  color: white;
  font-size: 1rem;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #2980b9;
}

.avatar-preview {
  margin-top: 10px;
  text-align: center;
}

.avatar-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ddd;
}

@media (max-width: 600px) {
  .review-form-container {
    padding: 15px;
  }
}
</style>
