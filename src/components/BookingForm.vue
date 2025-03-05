<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="name">Név:</label>
      <input type="text" id="name" v-model="name" required />
    </div>
    <div>
      <label for="phone">Telefonszám:</label>
      <input type="tel" id="phone" v-model="phone" required />
    </div>
    <button type="submit">Foglalás</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  selectedTimeSlot: String
})

const name = ref('')
const phone = ref('')

const submitForm = async () => {
  if (name.value && phone.value) {
    const appointment = {
      nev: name.value,
      telefonszam: phone.value,
      idopont: props.selectedTimeSlot
    }
    try {
      await axios.post('http://localhost:3000/foglalas', appointment)
      console.log('Form submitted:', appointment)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>