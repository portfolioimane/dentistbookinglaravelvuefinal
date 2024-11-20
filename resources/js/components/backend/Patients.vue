<template>
  <div>
    <h1>Patients with Confirmed Appointments</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>User Phone</th> <!-- Display user phone -->
          <th>Appointment Phone</th> <!-- Display appointment phone -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patientsData" :key="patient.id">
          <td>{{ patient.name }}</td>
          <td>{{ patient.email }}</td>
          <td>{{ patient.user_phone }}</td> <!-- Access the user phone -->
          <td>{{ patient.appointment_phone }}</td> <!-- Access the appointment phone -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patientsData: [],  // Local state to store the patients data
    };
  },
  async created() {
    try {
      // Fetch the patients data from the API
      const patientsData = await this.$store.dispatch('patients/fetchPatients');
      console.log('Patients data received:', patientsData);
      this.patientsData = patientsData;  // Store the fetched data locally
    } catch (error) {
      console.error('Error fetching patients in component:', error);
    }
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
