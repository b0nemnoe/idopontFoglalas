<template>
  <div>
    <h1>Időpontfoglalás</h1>
    <div>
      <label for="week-select">Válassza ki a hetet:</label>
      <select id="week-select" v-model="selectedWeek">
        <option v-for="week in weeks" :key="week.number" :value="week.number">
          {{ week.label }}
        </option>
      </select>
    </div>
    <AppointmentList @select="handleAppointmentSelect" :selectedWeek="selectedWeek" />
    <BookingForm v-if="selectedTimeSlot" :selectedTimeSlot="selectedTimeSlot" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppointmentList from '@/components/AppointmentList.vue'
import BookingForm from '@/components/BookingForm.vue'
import { useStore } from '@/stores/store.js'

const store = useStore()
const selectedTimeSlot = ref(null)
const selectedWeek = ref('1. hét')

const weeks = computed(() => {
  const weeksArray = []
  for (let i = 1; i <= 5; i++) {
    const startDate = new Date()
    startDate.setDate(1)
    startDate.setDate(startDate.getDate() + (i - 1) * 7)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    weeksArray.push({
      number: `${i}. hét`,
      label: `${i}. hét (${startDate.toLocaleDateString('hu-HU')} - ${endDate.toLocaleDateString('hu-HU')})`
    })
  }
  return weeksArray
})

const handleAppointmentSelect = (day, time) => {
  selectedTimeSlot.value = `${selectedWeek.value} ${day} ${time}`
  console.log("Updated selectedTimeSlot:", selectedTimeSlot.value) // Debug
}

watch(selectedWeek, (newWeek) => {
  store.fetchAppointments(newWeek)
})

onMounted(() => {
  store.fetchAppointments(selectedWeek.value)
})
</script>