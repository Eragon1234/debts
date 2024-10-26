<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})
</script>

<template>
  <UCard class="grid place-items-center h-screen">
    <CreateTransfer/>
  </UCard>
</template>

<style scoped>

</style>