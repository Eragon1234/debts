<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const {loggedIn} = useUserSession();
</script>

<template>
  Hallo Welt {{ loggedIn }}
</template>

<style scoped>

</style>