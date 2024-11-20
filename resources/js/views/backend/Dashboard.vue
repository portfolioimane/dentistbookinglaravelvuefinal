<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>

    <!-- Dashboard Stats Section -->
    <div class="stats">
      <div class="stat-card">
        <h3>Total Patients</h3>
        <p>{{ patientsCount }}</p> <!-- Display the total patients count -->
      </div>
      <div class="stat-card">
        <h3>Total Appointments</h3>
        <p>{{ totalAppointments }}</p> <!-- Display the total appointments -->
      </div>
   
    </div>

    <!-- Recent Appointments Section -->
    <div class="recent-appointments">
      <h2>Recent Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in recentAppointments" :key="appointment.id">
            <td>{{ appointment.name }}</td>
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.start_time }}-{{ appointment.end_time }}</td>
            <td>{{ appointment.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      patientsCount: 0,                // Initialize total patients count
      totalAppointments: 0,            // Initialize total appointments count
      appointments: [],                // Store all fetched appointments
    };
  },
  computed: {
    // Filter today's appointments from the fetched appointments
  
    // Get the three latest appointments from the fetched appointments
    recentAppointments() {
      return this.appointments
        .sort((a, b) => new Date(b.date) - new Date(a.date))  // Sort by date (latest first)
        .slice(0, 3);  // Get only the 3 most recent appointments
    }
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Fetch all patients data from the Vuex store
        const patients = await this.$store.dispatch('patients/fetchPatients');
        // Set the total number of patients
        this.patientsCount = patients.length;

        // Fetch all appointments data from the Vuex store
        const appointments = await this.$store.dispatch('fetchAppointments');
        // Set the total number of appointments and store them
        this.appointments = appointments;
        this.totalAppointments = appointments.length;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
  },
  mounted() {
    this.fetchDashboardData(); // Fetch data on component mount
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0;
  color: #007bff;
}

.stat-card p {
  font-size: 24px;
  margin-top: 10px;
}

.recent-appointments {
  margin-top: 20px;
}

.recent-appointments table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.recent-appointments th, .recent-appointments td {
  padding: 12px;
  border: 1px solid #ddd;
}
</style>
