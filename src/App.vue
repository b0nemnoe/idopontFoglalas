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
      <nav class="d-flex justify-content-center border-bottom py-2 ">
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
  gap: 10px;
  
}
.wrapper nav p > *{
  background-color: hsla(0, 0%, 0%, 0.317);
  border-radius: 1em;
  font-size: 1em;
  padding: 10px;
  text-decoration: none;
  color: black;
}
.wrapper nav p > *:hover{
  background-color: hsla(0, 0%, 0%, 0.527);
}

.wrapper{
  background-image: url(./src/images/barbershop.jpg);
  background-repeat: no-repeat;
  background-size:cover;
}

</style>