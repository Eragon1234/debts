<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const {data} = await useFetch("/api/transfers/debts")
const debts = Object.values(data.value)
</script>

<template>
  <template v-for="debt in debts" :key="debt.user.id">
    <UCard class="w-50">
      {{ debt.user.name }}
      <br />
      € {{ debt.amount }}
    </UCard>
  </template>
</template>

<style scoped>

</style>