<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const {user} = useUserSession();
console.log(user.value)
</script>

<template>
  Hallo Welt
</template>

<style scoped>

</style>