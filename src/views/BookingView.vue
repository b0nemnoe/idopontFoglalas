<template>
  <div class="text-center">
    <h1>Időpontfoglalás</h1>
    <div class="text-center">
      <label for="week-select" class="text-center">Válassza ki a hetet:</label>
      <select id="week-select" v-model="selectedWeek">
        <option v-for="week in weeks" :key="week.number" :value="week.number">
          {{ week.label }}
        </option>
      </select>
    </div>
    <AppointmentList @select="handleAppointmentSelect" :selectedWeek="selectedWeek" />
    <BookingForm :selectedTimeSlot="selectedTimeSlot" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppointmentList from '@/components/AppointmentList.vue'
import BookingForm from '@/components/BookingForm.vue'
import { useStore } from '@/stores/store.js'
import { Modal } from 'bootstrap'

const store = useStore()
const selectedTimeSlot = ref(null)
const selectedWeek = ref('1. hét')

const weeks = computed(() => {
  const weeksArray = []
  const today = new Date()

  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7))
  nextMonday.setHours(0,0,0,0)

  for (let i = 1; i <= 5; i++) {
    const startDate = new Date(nextMonday)
    startDate.setDate(nextMonday.getDate() + (i - 1) * 7)
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 4) 

    const options = { month: '2-digit', day: '2-digit' }
    const start = startDate.toLocaleDateString('hu-HU', options).replace(/\./g, '.')
    const end = endDate.toLocaleDateString('hu-HU', options).replace(/\./g, '.')

    weeksArray.push({
      number: `${i}. hét`,
      label: `(${start} - ${end})`,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })
  }

  return weeksArray
})




const handleAppointmentSelect = (day, time) => {
  selectedTimeSlot.value = `${selectedWeek.value} ${day} ${time}`
  console.log("Updated selectedTimeSlot:", selectedTimeSlot.value) 

  const bookingModal = new Modal(document.getElementById('bookingModal'))
  bookingModal.show()
}

watch(selectedWeek, (newWeek) => {
  store.fetchAppointments(newWeek)
})

onMounted(() => {
  store.fetchAppointments(selectedWeek.value)
})
</script>