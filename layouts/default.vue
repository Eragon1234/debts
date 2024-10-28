<script setup lang="ts">

</script>

<template>
  <UContainer>
    <div class="flex flex-row justify-between py-3">
      <NuxtLink to="/" class="text-3xl">Debts</NuxtLink>
      <NuxtLink to="/new-transfer" class="text-4xl">+</NuxtLink>
    </div>
    <slot/>
  </UContainer>
</template>

<style scoped>

</style>