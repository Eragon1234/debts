<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})
</script>

<template>
  <UCard class="grid place-items-center">
    <CreateTransfer/>
  </UCard>
</template>

<style scoped>

</style>