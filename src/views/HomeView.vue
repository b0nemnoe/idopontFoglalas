<template>
  <div class="container mt-5 text-center">
    <h1 class="mb-4">Üdvözöljük!</h1>
    <p class="lead">
      Köszöntjük a barbershop weboldalán. 
    </p>
    <p class="lead">
      Foglaljon időpontot gyorsan és egyszerűen az időpontfoglalás fül alatt.
    </p>

    <h2 class="mt-5">Árlista:</h2>
    <ul class="list-group">
      <li v-for="item in pricelist" :key="item.name" class="list-group-item">
        {{ item.name }} - {{ item.price }} Ft
      </li>
    </ul>
  </div>
</template>

<script setup>
const pricelist = [
  { name: 'Alap hajvágás', price: 5000 },
  { name: 'Kreatív hajvágás', price: 5500 },
  { name: 'Szakáll igazítás', price: 1000 },
  { name: 'Hajmosás', price: 500 },
  { name: 'teljeskörű ápolás', price: 6500 },
]
</script>

<style scoped>
.container {
  max-width: 600px;
}

.list-group-item {
  font-size: 1.2rem;
}
</style>
