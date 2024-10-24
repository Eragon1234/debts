<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const schema = z.object({
  username: z.string(),
  password: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive({
  username: undefined,
  name: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch('/api/password/authenticate', {
    method: "POST",
    body: event.data
  }).then(response => {
    navigateTo('/')
  }).catch(error => {
    console.log(error)
  })
}
</script>

<template>
  <UCard rounded>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username"/>
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password"/>
      </UFormGroup>

      <UButton type="submit">
        Sign In
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped>

</style>