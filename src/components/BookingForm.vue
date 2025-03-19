<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useStore } from '@/stores/store.js'
import { useToast } from 'vue-toastification'

const props = defineProps({
  selectedTimeSlot: String,
})

const store = useStore()
const toast = useToast()
const name = ref('')
const phone = ref('')

const daysMap = {
  Hétfő: 0,
  Kedd: 1,
  Szerda: 2,
  Csütörtök: 3,
  Péntek: 4,
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

const calculateAppointmentDate = (baseDate, weekNumber, dayName) => {
  const startDate = new Date(baseDate)
  startDate.setDate(baseDate.getDate() + (weekNumber - 1) * 7)
  const appointmentDate = new Date(startDate)
  appointmentDate.setDate(startDate.getDate() + daysMap[dayName])
  return appointmentDate
}

const parseSelectedTimeSlot = (selectedTimeSlot) => {
  const parts = selectedTimeSlot.split(' ')
  return {
    weekNumber: parseInt(parts[0], 10),
    dayName: parts[2],
    time: parts[3]
  }
}

const formattedSelectedTimeSlot = computed(() => {
  if (!props.selectedTimeSlot) return ''

  const { weekNumber, dayName, time } = parseSelectedTimeSlot(props.selectedTimeSlot)
  if (isNaN(weekNumber) || !dayName || !time) return 'Hibás formátum'

  const baseDate = new Date(2025, 2, 24)
  const appointmentDate = calculateAppointmentDate(baseDate, weekNumber, dayName)

  return `${formatDate(appointmentDate)} ${time}`
})

const submitForm = async () => {
  if (!name.value || !phone.value || !props.selectedTimeSlot) return

  try {
    const { weekNumber, dayName, time } = parseSelectedTimeSlot(props.selectedTimeSlot)

    const baseDate = new Date(2025, 2, 3) // Fix dátum a foglalásokhoz
    const appointmentDate = calculateAppointmentDate(baseDate, weekNumber, dayName)
    const formattedDate = formatDate(appointmentDate)

    // Foglaltság ellenőrzése
    const isBooked = store.appointments.some(
      (app) => app.idopont.startsWith(formattedDate) && app.idopont.endsWith(time)
    )

    if (isBooked) {
      toast.error('Ez az időpont már foglalt!')
      return
    }

    // Küldés a szerverre
    await axios.post('http://localhost:3000/foglalas', {
      nev: name.value,
      telefonszam: phone.value,
      idopont: `${formattedDate} ${time}`,
    })

    toast.success('Sikeres foglalás!')
    store.fetchAppointments(weekNumber.toString())

    // Form reset
    name.value = ''
    phone.value = ''
  } catch (error) {
    console.error('Hiba:', error)
    toast.error('Foglalási hiba!')
  }
}
</script>

<template>
  <div class="modal fade" id="bookingModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Időpontfoglalás</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p v-if="formattedSelectedTimeSlot" class="mb-3">
            Kiválasztott időpont:<br />
            <strong>{{ formattedSelectedTimeSlot }}</strong>
          </p>

          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Név:</label>
              <input v-model="name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Telefonszám:</label>
              <input v-model="phone" type="tel" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-primary w-100">Foglalás</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body strong {
  color: #0d6efd;
  font-size: 1.1em;
}
</style>