<template>
  <div
    class="appointment btn"
    :class="{ 'btn-secondary': !props.isBooked, 'btn-danger': props.isBooked }"
    @click="selectAppointment"
  >
    {{ time }}
  </div>
</template>

<script setup>
const props = defineProps({
  time: String,
  isBooked: Boolean
})

const emit = defineEmits(['select'])

const selectAppointment = () => {
  if (!props.isBooked) {
    emit('select', props.time)
  }
}
</script>

<style scoped>
.appointment {
  width: 100px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f9f9f9;
}

.appointment:hover {
  background-color: #e0e0e0;
}

.appointment.booked {
  background-color: #ffcccc;
  cursor: not-allowed;
}
</style>