<script setup lang="ts">
const items = [
  [
    {
      label: "Settings",
      to: "/settings",
      icon: "i-material-symbols:settings"
    }
  ]
]
const {loggedIn, user} = getUserSession();
</script>

<template>
  <UContainer class="w-3xl">
    <div class="flex flex-row justify-between py-3">
      <NuxtLink to="/" class="text-3xl">Debts</NuxtLink>
      <div class="flex flex-row items-center gap-4">
        <NuxtLink to="/new-transfer" class="text-4xl">+</NuxtLink>
        <UDropdownMenu :items="items" v-if="loggedIn">
          <UAvatar :alt="user?.name"/>
        </UDropdownMenu>
      </div>
    </div>
    <slot/>
  </UContainer>
</template>

<style scoped>

</style>
