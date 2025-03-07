<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useStore } from '@/stores/store.js'
import { useToast } from 'vue-toastification'

const props = defineProps({
  selectedTimeSlot: String
})

const store = useStore()
const toast = useToast()
const name = ref('')
const phone = ref('')

const formattedSelectedTimeSlot = computed(() => {
  if (!props.selectedTimeSlot) return ''

  const slotParts = props.selectedTimeSlot.split(' ')
  if (slotParts.length < 4) return 'Hibás selectedTimeSlot formátum'

  const week = slotParts[0]  // Példa: "1."
  const day = slotParts[2]  // Példa: "Kedd"
  const time = slotParts.slice(3).join(' ')  // Példa: "08:00"

  // A hét napjai, hogy meg tudjuk keresni a megfelelő eltolást
  const daysOfWeek = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"]
  const dayIndex = daysOfWeek.indexOf(day)
  if (dayIndex === -1) return 'Hibás napnév'

  // A kiválasztott hét első napjának kiszámítása
  const weekNumber = parseInt(week.split('.')[0], 10)
  const startDate = new Date()
  startDate.setDate(1)
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)

  // A pontos dátum kiszámítása az adott naphoz képest
  const appointmentDate = new Date(startDate)
  appointmentDate.setDate(startDate.getDate() + dayIndex)

  const formattedDate = appointmentDate.toISOString().split('T')[0].replace(/-/g, '/')
  return `${formattedDate} ${time}`
})

const submitForm = async () => {
  if (name.value && phone.value && props.selectedTimeSlot) {
    console.log("Raw selectedTimeSlot:", props.selectedTimeSlot); // Debug

    const slotParts = props.selectedTimeSlot.split(' '); 
    if (slotParts.length < 4) {  
      console.error("Hibás selectedTimeSlot formátum:", props.selectedTimeSlot);
      return;
    }

    const week = slotParts[0];  // Példa: "1."
    const day = slotParts[2];  // Példa: "Kedd"
    const time = slotParts.slice(3).join(' '); // Példa: "08:00"

    console.log("Extracted values:", { week, day, time }); // Debug

    // A hét napjai, hogy meg tudjuk keresni a megfelelő eltolást
    const daysOfWeek = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
    const dayIndex = daysOfWeek.indexOf(day);
    if (dayIndex === -1) {
      console.error("Hibás napnév:", day);
      return;
    }

    // A kiválasztott hét első napjának kiszámítása
    const weekNumber = parseInt(week.split('.')[0], 10);
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

    // A pontos dátum kiszámítása az adott naphoz képest
    const appointmentDate = new Date(startDate);
    appointmentDate.setDate(startDate.getDate() + dayIndex);
    
    const formattedDate = appointmentDate.toISOString().split('T')[0].replace(/-/g, '/');

    // Check if the selected time slot is already booked
    const isAlreadyBooked = store.appointments.some(appointment => 
      appointment.idopont === `${formattedDate} ${time}`
    );

    if (isAlreadyBooked) {
      console.error('Ez az időpont már foglalt:', `${formattedDate} ${time}`);
      toast.error("Ez az időpont már foglalt!")
      return;
    }

    const appointment = {
      nev: name.value,
      telefonszam: phone.value,
      idopont: `${formattedDate} ${time}` // Most már a helyes dátummal!
    };

    console.log("Final appointment object:", appointment); // Debug

    try {
      await axios.post('http://localhost:3000/foglalas', appointment);
      console.log('Foglalás sikeresen mentve:', appointment);
      store.fetchAppointments(week); // Refresh appointments
      toast.success("Foglalás sikeresen mentve!")
    } catch (error) {
      console.error('Hiba a foglalás mentésekor:', error);
      toast.error("Hiba a foglalás mentésekor!")
    }
  }
};
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="text-center mb-4">Foglalási űrlap</h2>
        <p class="text-center mb-4">Kiválasztott időpont: {{ formattedSelectedTimeSlot }}</p>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="name" class="form-label">Név:</label>
            <input id="name" v-model="name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Telefonszám:</label>
            <input id="phone" v-model="phone" type="text" class="form-control" required />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary w-100">Foglalás</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 400px;
}
.card {
  border-radius: 10px;
  padding: 20px;
}
</style>