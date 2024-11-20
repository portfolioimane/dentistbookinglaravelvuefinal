<template>
  <div>
    <h1>Reviews List</h1>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Avatar</th> <!-- New Avatar Column -->
          <th>Service</th>
          <th>Stars</th>
          <th>Content</th>
          <th>Featured</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.id">
          <td>{{ review.id }}</td>
          <td>{{ review.user.name }}</td>
          <td>
            <!-- Avatar Image -->
            <img v-if="review.avatar" :src="`/storage/${review.avatar}`" alt="User Avatar" class="avatar" />
            <span v-else>No Avatar</span>
          </td>
          <td>{{ review.service.name }}</td>
          <td>{{ review.stars }}</td>
          <td>
            <div class="content-column">
              <span v-if="!review.isExpanded">{{ truncateContent(review.content) }}</span>
              <span v-else>{{ review.content }}</span>
              <button 
                v-if="review.content.length > 50" 
                @click="toggleContent(review.id)"
                class="btn btn-link btn-sm">
                {{ review.isExpanded ? 'Read Less' : 'Read More' }}
              </button>
            </div>
          </td>
          <td>
            <span :class="{'text-success': review.featured, 'text-muted': !review.featured}">
              {{ review.featured ? 'Yes' : 'No' }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-primary"
              @click="handleToggleFeatured(review.id)"
            >
              {{ review.featured ? 'Unfeature' : 'Make it Featured' }}
            </button>
            <button
              class="btn btn-danger btn-sm ml-2"
              @click="handleDeleteReview(review.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ReviewsList",
  computed: {
    ...mapGetters("reviews", ["allReviews"]),
    reviews() {
      return this.allReviews;
    },
  },
  methods: {
    ...mapActions("reviews", ["fetchReviews", "toggleFeatured", "deleteReview"]),

    // Local method to handle toggling featured status
    async handleToggleFeatured(reviewId) {
      try {
        await this.toggleFeatured(reviewId); // Call Vuex action
        await this.fetchReviews(); // Refresh the reviews list
      } catch (error) {
        console.error("Error toggling featured status:", error);
      }
    },

    // Method to truncate content to 100 characters
    truncateContent(content) {
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    },

    // Method to toggle content visibility
    toggleContent(reviewId) {
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        review.isExpanded = !review.isExpanded;
      }
    },

    // Method to handle review deletion with SweetAlert2
    async handleDeleteReview(reviewId) {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
          await this.deleteReview(reviewId); // Call Vuex action to delete review
          this.fetchReviews(); // Refresh the reviews list
          Swal.fire('Deleted!', 'The review has been deleted.', 'success'); // Show success message
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire('Error!', 'Failed to delete the review.', 'error'); // Show error message
      }
    },
  },
  mounted() {
    this.fetchReviews(); // Fetch reviews when the component is mounted
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.table th {
  background-color: #f4f4f4;
}
.text-success {
  color: green;
}
.text-muted {
  color: gray;
}

/* Style for the content column */
.content-column {
  max-width: 300px; /* Limit width to avoid horizontal overflow */
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Ensure long words break correctly */
}

/* Avatar styling */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* Button spacing */
button.ml-2 {
  margin-left: 10px; /* Adds space between the buttons */
}

button.btn-link {
  padding: 0;
  font-size: 0.9em;
  text-decoration: underline;
  color: #2196F3 !important;
}

/* Style for delete button */
button.btn-danger {
  background-color: #f44336;
  border-color: #f44336;
}

button.btn-danger:hover {
  background-color: #e53935;
  border-color: #e53935;
}

button.btn-sm {
  font-size: 0.875rem; /* Smaller font size for delete button */
  padding: 5px 10px; /* Smaller padding for delete button */
}
</style>
