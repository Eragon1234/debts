<script setup lang="ts">
import {z} from "zod";
import type {ButtonProps, FormSubmitEvent} from "#ui/types";
import {signInSchema} from "#shared/schemas/SignInSchema";
import type {AuthFormField} from "@nuxt/ui";

type Schema = z.output<typeof signInSchema>

const toast = useToast()

const runtimeConfig = useRuntimeConfig()
const handleOidcLogin = async () => {
  await navigateTo('/api/oidc/login', {external: true})
}

const provider = {
  label: runtimeConfig.public.oidcName,
  icon: "i-lucide-log-in",
  click: handleOidcLogin
}
const providers: ButtonProps[] = []
if (runtimeConfig.public.oidcDiscoveryURL) {
  providers.push(provider)
}

const fields: AuthFormField[] = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
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
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :schema="signInSchema"
          :providers="providers"
          :fields="fields"
          title="Welcome back!"
          icon="i-lucide-lock"
          @submit="onSubmit"
      >
        <template #description>
          Don't have an account?
          <ULink to="/register" class="text-primary font-medium">Sign up</ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>