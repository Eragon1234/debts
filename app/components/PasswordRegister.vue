<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {createUserSchema} from "#shared/schemas/CreateUserSchema";
import type {AuthFormField} from "@nuxt/ui";

type Schema = z.output<typeof createUserSchema>

const fields: AuthFormField[] = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true
  },
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your name",
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
]

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch('/api/users', {
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
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :schema="createUserSchema"
          :fields="fields"
          title="Register"
          icon="i-lucide-lock"
          @submit="onSubmit"
      >
        <template #description>
          Already have an account?
          <ULink to="/signin" class="text-primary font-medium">Sign in</ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>