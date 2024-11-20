<template>
  <div class="testimonials-container">
    <h2>Our Featured Reviews</h2>
    <div class="testimonials">
      <div v-for="review in latestFeaturedReviews" :key="review.id" class="testimonial-card">
        <div class="testimonial-avatar">
          <!-- Use the getAvatarUrl method to display the avatar -->
          <img :src="getAvatarUrl(review.avatar)" alt="User Avatar" />
        </div>
        <div class="testimonial-content">
          <div class="testimonial-header">
            <h4>{{ review.user.name }}</h4>
            <div class="stars">
              <!-- Render stars based on review.stars -->
              <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= review.stars }">★</span>
            </div>
          </div>
          <p class="content">{{ review.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    latestFeaturedReviews() {
      return this.$store.getters['reviews/latestFeaturedReviews'];
    }
  },
  mounted() {
    this.$store.dispatch('reviews/fetchLatestFeaturedReviews');
  },
  methods: {
    // Method to get the full URL of the avatar image
    getAvatarUrl(avatar) {
      // Check if avatar exists, then return the correct URL
      return avatar ? `/storage/${avatar}` : '/default-avatar.png'; // Fallback to a default avatar if not present
    }
  }
};
</script>

<style scoped>
.testimonials-container {
  padding: 20px;
  text-align: center;
}

.testimonials {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.testimonial-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 30%;
  text-align: center;
}

.testimonial-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.testimonial-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.testimonial-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.stars {
  margin-top: 5px;
}

.star {
  color: #ccc;
  font-size: 18px;
}

.star.filled {
  color: gold;
}

.content {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}
</style>
