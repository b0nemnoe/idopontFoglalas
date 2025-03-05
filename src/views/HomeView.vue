<template>
  <div class="home">
    <h1>Welcome to the Appointment Booking System</h1>
    <p>Book your appointments easily from Monday to Friday between 8 AM and 4 PM.</p>
    <router-link to="/foglalas" class="booking-link">Go to Booking</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

.booking-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.booking-link:hover {
  background-color: #0056b3;
}
</style>