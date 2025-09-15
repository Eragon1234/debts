<script setup lang="ts">
import type {TabsItem} from "@nuxt/ui";

definePageMeta({
  middleware: 'guest'
})

const items = [
  {
    label: "Sign In",
    slot: "signin" as const
  },
  {
    label: "Register",
    slot: "register" as const
  },
] satisfies TabsItem[]

</script>

<template>
  <div class="grid place-items-center">
    <UTabs :items="items">
      <template #signin>
          <PasswordSignIn/>
      </template>
      <template #register>
        <PasswordRegister/>
      </template>
    </UTabs>
  </div>
</template>

<style scoped>

</style>