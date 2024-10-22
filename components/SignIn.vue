<script setup lang="ts">
import {z} from 'zod'
import type {FormSubmitEvent} from '#ui/types'

const schema = z.object({
  username: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive({
  username: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<template>
  <UCard rounded>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username"/>
      </UFormGroup>

      <UButton type="submit">
        Sign In
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped>

</style>