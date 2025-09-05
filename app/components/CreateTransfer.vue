<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const schema = z.object({
  sender: z.number().int(),
  receivers: z.array(z.object({
    id: z.number(),
    username: z.string()
  })),
  amount: z.number(),
  description: z.string(),
  date: z.iso.date().default(() => new Date().toISOString())
})

type Schema = z.output<typeof schema>

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
  }).then(response => {
    navigateTo("/")
  }).catch((error) => {
    toast.add({
      title: "Error",
      description: error.data.message,
      color: "red",
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

const items = [
  {
    key: "new",
    label: "New",
  },
  {
    key: "old",
    label: "Old",
  },
]
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
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