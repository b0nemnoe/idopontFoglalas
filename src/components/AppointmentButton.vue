<template>
  <button
    class="appointment btn"
    :class="{ 'btn-outline-dark': !props.isBooked, 'btn-danger': props.isBooked }"
    @click="selectAppointment"
  >
    {{ time }}
  </button>
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
  width: 120px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.appointment:hover {
  transform: scale(1.05);
}

.appointment.btn-danger {
  cursor: not-allowed;
}
</style>