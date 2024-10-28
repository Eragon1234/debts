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
  <div class="grid place-items-center">
    <UTabs :items="items">
      <template #item="{ item }">
        <div v-if="item.key === 'signin'">
          <PasswordSignIn/>
        </div>
        <div v-else>
          <PasswordRegister/>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped>

</style>