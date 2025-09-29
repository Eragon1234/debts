<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {createTransferSchema} from "#shared/schemas/CreateTransferSchema";

definePageMeta({
  middleware: "auth"
})

type Schema = z.output<typeof createTransferSchema>

const state = reactive<Partial<Schema>>({
  sender: undefined,
  receivers: [],
  amount: undefined,
  description: undefined,
  date: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch("/api/transfers", {
    body: event.data,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(_ => {
    navigateTo("/")
  }).catch((error) => {
    toast.add({
      title: "Error",
      description: error.data.message,
      color: "error",
    })
    console.dir(error)
  })
}

const receiversSearchTerm = ref<string>('');
const { data: receiversSearchItems, status: receiversSearchStatus } = await useFetch('/api/users/search', {
  query: {
    query: receiversSearchTerm.value,
  },
  transform: (data) => data.map(u => ({label: u.username, value: u})),
  watch: [receiversSearchTerm]
})

const senderSearchTerm = ref<string>('');
const { data: senderSearchItems, status: senderSearchStatus } = await useFetch('/api/users/search', {
  query: {
    query: senderSearchTerm.value,
  },
  transform: (data) => data.map(u => ({label: u.username, value: u.id})),
  watch: [senderSearchTerm]
})
</script>

<template>
  <UForm :schema="createTransferSchema" :state="state" @submit="onSubmit">
    <USelectMenu
        v-model="state.receivers"
        name="receiver"
        :items="receiversSearchItems"
        v-model:search-term="receiversSearchTerm"
        :loading="receiversSearchStatus === 'pending'"
        class="inline-block w-fit min-w-28"
        required multiple
    />
    owes
    <USelectMenu
        v-model="state.sender"
        name="sender"
        :items="senderSearchItems"
        v-model:search-term="senderSearchTerm"
        :loading="senderSearchStatus === 'pending'"
        class="inline-block w-fit min-w-28"
        required
    />
    <UInput v-model="state.amount" type="number" class="inline-block w-28 ml-1" placeholder="Amount" required/>
    €
    for
    <UInput v-model="state.description" type="text" class="inline-block w-52" required/>
    on
    <UInput v-model="state.date" type="date" class="inline-block" required/>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<style scoped>

</style>