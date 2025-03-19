import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export const useStore = defineStore('store', () => {
  const appointments = ref([])
  const toast = useToast()
  const weekTimeSlots = ref({
    Hétfő: [
      { time: '08:00', isBooked: false },
      { time: '09:00', isBooked: false },
      { time: '10:00', isBooked: false },
      { time: '11:00', isBooked: false },
      { time: '12:00', isBooked: false },
      { time: '13:00', isBooked: false },
      { time: '14:00', isBooked: false },
      { time: '15:00', isBooked: false },
      { time: '16:00', isBooked: false },
    ],
    Kedd: [
      { time: '08:00', isBooked: false },
      { time: '09:00', isBooked: false },
      { time: '10:00', isBooked: false },
      { time: '11:00', isBooked: false },
      { time: '12:00', isBooked: false },
      { time: '13:00', isBooked: false },
      { time: '14:00', isBooked: false },
      { time: '15:00', isBooked: false },
      { time: '16:00', isBooked: false },
    ],
    Szerda: [
      { time: '08:00', isBooked: false },
      { time: '09:00', isBooked: false },
      { time: '10:00', isBooked: false },
      { time: '11:00', isBooked: false },
      { time: '12:00', isBooked: false },
      { time: '13:00', isBooked: false },
      { time: '14:00', isBooked: false },
      { time: '15:00', isBooked: false },
      { time: '16:00', isBooked: false },
    ],
    Csütörtök: [
      { time: '08:00', isBooked: false },
      { time: '09:00', isBooked: false },
      { time: '10:00', isBooked: false },
      { time: '11:00', isBooked: false },
      { time: '12:00', isBooked: false },
      { time: '13:00', isBooked: false },
      { time: '14:00', isBooked: false },
      { time: '15:00', isBooked: false },
      { time: '16:00', isBooked: false },
    ],
    Péntek: [
      { time: '08:00', isBooked: false },
      { time: '09:00', isBooked: false },
      { time: '10:00', isBooked: false },
      { time: '11:00', isBooked: false },
      { time: '12:00', isBooked: false },
      { time: '13:00', isBooked: false },
      { time: '14:00', isBooked: false },
      { time: '15:00', isBooked: false },
      { time: '16:00', isBooked: false },
    ],
  })

  const handleSelect = (day, time) => {
    console.log(`Selected: ${day} ${time}`)
  }

  // Frissítsd a fetchAppointments függvényt:
  const fetchAppointments = async (selectedWeek) => {
    try {
      const response = await axios.get('http://localhost:3000/foglalas')
      const fetchedAppointments = response.data
      appointments.value = fetchedAppointments

      // Új reaktív objektum létrehozása
      const newSlots = JSON.parse(JSON.stringify(weekTimeSlots.value))

      // Reset all slots
      Object.keys(newSlots).forEach((day) => {
        newSlots[day].forEach((slot) => (slot.isBooked = false))
      })

      const weekNumber = parseInt(selectedWeek.split('.')[0], 10)
      const startDate = new Date(2025, 2, 24) 
      startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)

      // Péntek 23:59:59-ig
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 4)
      endDate.setHours(23, 59, 59, 999)

      fetchedAppointments.forEach((appointment) => {
        const [date, time] = appointment.idopont.split(' ')
        const [year, month, day] = date.split('/').map(Number)
        const appointmentDate = new Date(year, month - 1, day)

        if (appointmentDate >= startDate && appointmentDate <= endDate) {
          const options = { weekday: 'long' }
          const dayName = new Intl.DateTimeFormat('hu-HU', options)
            .format(appointmentDate)
            .replace(/^./, (c) => c.toUpperCase())

          const targetDay = newSlots[dayName]
          if (targetDay) {
            const slot = targetDay.find((s) => s.time === time)
            if (slot) slot.isBooked = true
          }
        }
      })

      // Reaktív frissítés
      weekTimeSlots.value = newSlots
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Nem sikerült betölteni a foglalásokat!')
    }
  }

  const clearAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/foglalas')
      const fetchedAppointments = response.data
      for (const appointment of fetchedAppointments) {
        await axios.delete(`http://localhost:3000/foglalas/${appointment.id}`)
      }

      appointments.value = []

      Object.keys(weekTimeSlots.value).forEach((day) => {
        weekTimeSlots.value[day].forEach((slot) => {
          slot.isBooked = false
        })
      })

      console.log('All appointments have been cleared.')
      toast.success('Minden foglalás törölve lett!')
    } catch (error) {
      console.error('Error clearing appointments:', error)
      toast.error('Nem sikerült törölni a foglalásokat!')
    }
  }

  return { appointments, fetchAppointments, clearAppointments, weekTimeSlots, handleSelect, toast }
})
