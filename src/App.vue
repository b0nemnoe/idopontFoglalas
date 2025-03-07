<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useStore } from '@/stores/store.js'

const store = useStore()

onMounted(() => {
  store.fetchAppointments('1. hét')
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <p>
          <RouterLink to="/">Főoldal</RouterLink>
        </p>
        <p>
          <RouterLink to="/foglalas">Időpontfoglalás</RouterLink>
        </p>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.wrapper nav {
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
}
</style>