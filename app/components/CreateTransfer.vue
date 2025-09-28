<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import type {createTransferSchema} from "#shared/schemas/CreateTransferSchema";

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

async function searchUsers(query: string) {
  return $fetch("/api/users/search", {
    query: {
      query: query,
    }
  })
}
</script>

<template>
  <UForm :schema="createTransferSchema" :state="state" @submit="onSubmit">
    <USelectMenu v-model="state.receivers" :searchable="searchUsers" name="receiver"
                 option-attribute="username" class="inline-block w-fit min-w-28" required
                 multiple>
      <template #label>
        <span v-if="state.receivers?.length" class="truncate">{{ state.receivers.map(r => r.username).join(', ') }}</span>
      </template>
    </USelectMenu>
    owes
    <USelectMenu v-model="state.sender" :searchable="searchUsers" name="sender"
                 option-attribute="username" value-attribute="id" class="inline-block w-fit min-w-28" required/>
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