<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const schema = z.object({
  password: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive({
  password: undefined,
})

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch(`/api/password/`, {
    method: "PATCH",
    body: event.data
  }).then(() => {
    toast.add({
      title: "Success",
      description: "Password successfully changed!"
    })
  }).catch(err => {
    toast.add({
      title: "Error",
      description: err.data.message,
      color: "red"
    })
  })
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormGroup label="New password" name="password">
      <UInput v-model="state.password" type="password"/>
    </UFormGroup>

    <UButton type="submit">
      Change Password
    </UButton>
  </UForm>
</template>

<style scoped>

</style>