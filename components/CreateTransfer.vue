<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const schema = z.object({
  sender: z.number().int(),
  receiver: z.number().int(),
  amount: z.number(),
  description: z.string(),
  date: z.string().date().default(() => new Date().toISOString())
})

type Schema = z.output<typeof schema>

const state = reactive({
  sender: undefined,
  receiver: undefined,
  amount: undefined,
  description: undefined,
  date: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch("/api/transfers/create", {
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
  return $fetch("/api/search-users", {
    query: {
      query: query,
    }
  })
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormGroup label="Sender" name="sender">
      <USelectMenu v-model="state.sender" :searchable="searchUsers" name="sender"
                   option-attribute="username" value-attribute="id"/>
    </UFormGroup>

    <UFormGroup label="Receiver" name="receiver">
      <USelectMenu v-model="state.receiver" :searchable="searchUsers" name="recipient"
                   option-attribute="username" value-attribute="id"/>
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UInput v-model="state.description" type="text"/>
    </UFormGroup>

    <UFormGroup label="Amount" name="amount">
      <UInput v-model="state.amount" type="number"/>
    </UFormGroup>

    <UFormGroup label="Date" name="date">
      <UInput v-model="state.date" type="date"/>
    </UFormGroup>

    <UButton type="submit">
      Create Transfer
    </UButton>
  </UForm>
</template>

<style scoped>

</style>