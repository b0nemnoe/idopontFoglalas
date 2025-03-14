<template>
  <div class="d-flex flex-row gap-4 justify-content-center container">
    <div v-for="(slots, day) in store.weekTimeSlots" :key="day" class="d-flex flex-column gap-3">
      <h3 class="text-dark">{{ day }}</h3>
      <div v-for="slot in slots" :key="slot.time" class="d-flex flex-column gap-2">
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
import AppointmentButton from './AppointmentButton.vue'
import { useStore } from '@/stores/store.js'

const store = useStore()

const emit = defineEmits(['select'])

const handleSelect = (day, time) => {
  emit('select', day, time)
}
</script>