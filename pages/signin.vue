<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

const items = [
  {
    key: "signin",
    label: "Sign In",
  },
  {
    key: "register",
    label: "Register",
  },
]
</script>

<template>
  <UCard class="grid place-items-center h-screen">
    <UTabs :items="items">
      <template #item="{ item }">
        <div v-if="item.key === 'signin'">
          <SignIn/>
        </div>
        <div v-else>
          <Register/>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>

<style scoped>

</style>