<script setup lang="ts">
const props = defineProps<{
  id: number
}>()

const {data, refresh} = useFetch(`/api/count/${props.id}`)

const updateCount = async (newCount: number) => {
  await $fetch(`/api/count/${props.id}/set`, {
    method: 'POST',
    body: {count: newCount}
  });
  refresh()
};
</script>

<template>
  <div v-if="data" class="h-full w-28 flex flex-row justify-between text-2xl my-auto">
    <button @click="updateCount(data.count - 1)">-</button>
    <span>{{data.count}}</span>
    <button @click="updateCount(data.count + 1)">+</button>
  </div>
</template>

<style scoped>

</style>