<template>
  <div class="time-slot-list">
    <div v-for="(slots, day) in weekTimeSlots" :key="day" class="day-slot">
      <h3>{{ day }}</h3>
      <div v-for="slot in slots" :key="slot.time" class="time-slot-wrapper">
        <AppointmentButton
          :time="slot.time"
          :isBooked="slot.isBooked"
          @select="handleSelect(day, slot.time)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppointmentButton from './AppointmentButton.vue'

const emit = defineEmits(['select'])

const weekTimeSlots = ref({
  Hétfő: [
    { time: '08:00', isBooked: false },
    { time: '09:00', isBooked: true },
    { time: '10:00', isBooked: false },
    { time: '11:00', isBooked: false },
    { time: '12:00', isBooked: true },
    { time: '13:00', isBooked: false },
    { time: '14:00', isBooked: false },
    { time: '15:00', isBooked: true },
    { time: '16:00', isBooked: false },
  ],
  Kedd: [
    { time: '08:00', isBooked: false },
    { time: '09:00', isBooked: false },
    { time: '10:00', isBooked: true },
    { time: '11:00', isBooked: false },
    { time: '12:00', isBooked: false },
    { time: '13:00', isBooked: true },
    { time: '14:00', isBooked: false },
    { time: '15:00', isBooked: false },
    { time: '16:00', isBooked: true },
  ],
  Szerda: [
    { time: '08:00', isBooked: true },
    { time: '09:00', isBooked: false },
    { time: '10:00', isBooked: false },
    { time: '11:00', isBooked: true },
    { time: '12:00', isBooked: false },
    { time: '13:00', isBooked: false },
    { time: '14:00', isBooked: true },
    { time: '15:00', isBooked: false },
    { time: '16:00', isBooked: false },
  ],
  Csütörtök: [
    { time: '08:00', isBooked: false },
    { time: '09:00', isBooked: true },
    { time: '10:00', isBooked: false },
    { time: '11:00', isBooked: false },
    { time: '12:00', isBooked: true },
    { time: '13:00', isBooked: false },
    { time: '14:00', isBooked: false },
    { time: '15:00', isBooked: true },
    { time: '16:00', isBooked: false },
  ],
  Péntek: [
    { time: '08:00', isBooked: false },
    { time: '09:00', isBooked: false },
    { time: '10:00', isBooked: true },
    { time: '11:00', isBooked: false },
    { time: '12:00', isBooked: false },
    { time: '13:00', isBooked: true },
    { time: '14:00', isBooked: false },
    { time: '15:00', isBooked: false },
    { time: '16:00', isBooked: true },
  ],
})

const handleSelect = (day, time) => {
  emit('select', day, time)
}

const fetchAppointments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/appointments')
    const appointments = response.data
    appointments.forEach(appointment => {
      const day = appointment.day
      const time = appointment.time
      const slot = weekTimeSlots.value[day].find(slot => slot.time === time)
      if (slot) {
        slot.isBooked = true
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.time-slot-list {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.day-slot {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-slot-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>