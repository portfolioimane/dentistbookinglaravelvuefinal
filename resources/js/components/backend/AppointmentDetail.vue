<template>
  <div class="appointment-detail">
    <h2>Appointment Details</h2>
    <div v-if="appointment">
      <p><strong>Name:</strong> {{ appointment.name }}</p>
      <p><strong>Email:</strong> {{ appointment.email }}</p>
      <p><strong>Phone:</strong> {{ appointment.phone }}</p>
      <p><strong>Date:</strong> {{ appointment.date }}</p>
      <p><strong>Time:</strong> {{ appointment.start_time }} - {{ appointment.end_time }}</p>
      <p><strong>Service:</strong> {{ appointment.service.name }}</p>
      <p><strong>Status:</strong> {{ appointment.status }}</p>
      <p><strong>Payment Status:</strong> {{ appointment.payment_status }}</p>
      <p><strong>Payment Method:</strong> {{ appointment.payment_method }}</p>
    </div>
    <div v-else>
      <p>Loading appointment details...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'], // Receive the appointment ID from route params
  data() {
    return {
      appointment: null, // Store appointment data here
    };
  },
  created() {
    this.fetchAppointmentDetails();
  },
  methods: {
    async fetchAppointmentDetails() {
      try {
        // Fetch the appointment details using the appointment ID from the route params
        const response = await this.$store.dispatch('fetchAppointmentBackendById', this.$route.params.id);
        this.appointment = response; // Assuming the API returns the appointment object
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      }
    },
  },
};
</script>

<style scoped>
.appointment-detail {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.appointment-detail h2 {
  text-align: center;
}

.appointment-detail p {
  font-size: 18px;
  margin: 10px 0;
}
</style>
