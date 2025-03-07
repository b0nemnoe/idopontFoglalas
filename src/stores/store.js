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
    console.log(`Selected: ${day} ${time}`)
  }

  const fetchAppointments = async (selectedWeek) => {
    try {
      const response = await axios.get('http://localhost:3000/foglalas')
      const fetchedAppointments = response.data
      appointments.value = fetchedAppointments // Save fetched appointments to the ref

      // Clear isBooked status for all slots
      Object.keys(weekTimeSlots.value).forEach(day => {
        weekTimeSlots.value[day].forEach(slot => {
          slot.isBooked = false
        })
      })

      const weekNumber = parseInt(selectedWeek.split('.')[0], 10)
      const startDate = new Date()
      startDate.setDate(1)
      startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      fetchedAppointments.forEach(appointment => {
        const [date, time] = appointment.idopont.split(' ')
        const appointmentDate = new Date(date)
        if (appointmentDate >= startDate && appointmentDate <= endDate) {
          const day = appointmentDate.toLocaleDateString('hu-HU', { weekday: 'long' })
          const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1)
          const slot = weekTimeSlots.value[dayCapitalized]?.find(slot => slot.time === time)
          if (slot) {
            slot.isBooked = true
          }
        }
      })
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error("Nem sikerült betölteni a foglalásokat!")
    }
  }

  const clearAppointments = async () => {
    try {
      // Delete all appointments from the server
      const response = await axios.get('http://localhost:3000/foglalas')
      const fetchedAppointments = response.data
      for (const appointment of fetchedAppointments) {
        await axios.delete(`http://localhost:3000/foglalas/${appointment.id}`)
      }

      // Clear the appointments ref
      appointments.value = []

      // Clear isBooked status for all slots
      Object.keys(weekTimeSlots.value).forEach(day => {
        weekTimeSlots.value[day].forEach(slot => {
          slot.isBooked = false
        })
      })

      console.log('All appointments have been cleared.')
      toast.success("Minden foglalás törölve lett!")
    } catch (error) {
      console.error('Error clearing appointments:', error)
      toast.error("Nem sikerült törölni a foglalásokat!")
    }
  }

  return { appointments, fetchAppointments, clearAppointments, weekTimeSlots, handleSelect, toast }
})