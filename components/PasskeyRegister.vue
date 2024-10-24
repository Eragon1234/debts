<script setup lang="ts">
import {z} from 'zod'
import type {FormSubmitEvent} from '#ui/types'

const toast = useToast()
const { fetch } = useUserSession()
const { register } = useWebAuthn()

const schema = z.object({
  name: z.string(),
  username: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: undefined,
  username: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await register({
    userName: event.data.username,
    displayName: event.data.name
  })
      .then(fetch)
      .then(async () => await navigateTo('/'))
      .catch((error) => {
        toast.add({
          title: error.data?.message || error.message,
          description: error.data?.data?.issues[0]?.message || error.data?.data,
          color: 'red'
        })
      })
}
</script>

<template>
  <UCard rounded>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Full Name" name="name">
        <UInput v-model="state.name"/>
      </UFormGroup>

      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UButton type="submit">
        Register
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped>

</style>