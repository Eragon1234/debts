<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

const route = useRoute();
const user = getUserSession()
const {userid} = route.params;
const debts = await useFetch(`/api/transfers/${userid}`);
const debtsByDate = new Map();
for (const debt of debts.data.value) {
  if (!debtsByDate.has(debt.date)) {
    debtsByDate.set(debt.date, []);
  }
  if (debt.receiverId === user.user!.id) {
    debt.amount = -debt.amount;
  }
  debtsByDate.get(debt.date).push(debt);
}
</script>

<template>
  <div class="w-96 mx-auto">
    <template v-for="[date, debts] in debtsByDate">
      <USeparator :label="date.toLocaleString()" class="mb-3 mt-6"/>
      <div v-for="debt in debts">
        <UCard>
          <div class="flex flex-row justify-between">
          <span>
            {{ debt.description }}
          </span>
            <span>
            {{ debt.amount }}
          </span>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>