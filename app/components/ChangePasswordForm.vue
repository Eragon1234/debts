<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {changePasswordSchema} from "#shared/schemas/ChangePasswordSchema";

type Schema = z.output<typeof changePasswordSchema>

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
      color: "error"
    })
  })
}
</script>

<template>
  <UForm :schema="changePasswordSchema" :state="state" @submit="onSubmit">
    <UFormField label="New password" name="password">
      <UInput v-model="state.password" type="password"/>
    </UFormField>

    <UButton type="submit">
      Change Password
    </UButton>
  </UForm>
</template>

<style scoped>

</style>