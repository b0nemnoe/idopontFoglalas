<template>
  <div>
    <h1>Időpontfoglalás</h1>
    <AppointmentList @select="handleAppointmentSelect" />
    <BookingForm v-if="selectedTimeSlot" :selectedTimeSlot="selectedTimeSlot" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppointmentList from '@/components/AppointmentList.vue'
import BookingForm from '../components/BookingForm.vue'

const selectedTimeSlot = ref(null)

const handleAppointmentSelect = (time) => {
  selectedTimeSlot.value = time
}
</script>