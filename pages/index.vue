<script setup lang="ts">
import Counter from "~/components/Counter.vue";

definePageMeta({
  middleware: 'auth'
})

const {data} = await useFetch("/api/transfers/debts")
const debts = Object.values(data.value)
</script>

<template>
  <template v-if="debts.length === 0">
    You don't have any debts (yet).
  </template>
  <template v-else v-for="debt in debts" :key="debt.user.id">
    <UCard class="w-50">
      <div class="flex flex-row justify-between">
        <div>
          <NuxtLink :to="'/debts/' + debt.user.id">
            {{ debt.user.name }}
          </NuxtLink>
          <br/>
          € {{ debt.amount.toFixed(2) }}
        </div>
        <ClientOnly>
          <Counter :id="debt.user.id"/>
        </ClientOnly>
      </div>
    </UCard>
  </template>
</template>

<style scoped>

</style>