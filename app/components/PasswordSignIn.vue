<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {signInSchema} from "#shared/schemas/SignInSchema";

type Schema = z.output<typeof signInSchema>

const state = reactive({
  username: undefined,
  name: undefined,
  password: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch('/api/password/authenticate', {
    method: "POST",
    body: event.data
  }).then(_ => {
    navigateTo('/')
  }).catch(error => {
    toast.add({
      title: "Error",
      description: error.data.message,
      color: "error",
    })
    console.dir(error)
  })
}
</script>

<template>
  <UCard rounded>
    <UForm :schema="signInSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username"/>
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password"/>
      </UFormField>

      <UButton type="submit">
        Sign In
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped>

</style>