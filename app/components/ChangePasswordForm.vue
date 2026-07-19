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
  <UPageCard title="Change Password" variant="subtle">
    <UForm :schema="changePasswordSchema" :state="state" @submit="onSubmit" class="flex flex-col gap-4">
      <UFormField name="password">
        <UInput v-model="state.password" type="password" placeholder="New Password"/>
      </UFormField>

      <UButton type="submit">
        Update
      </UButton>
    </UForm>
  </UPageCard>
</template>

<style scoped>

</style>