<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {changePasswordSchema} from "#shared/schemas/ChangePasswordSchema";

type Schema = z.output<typeof changePasswordSchema>

const state = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  newPasswordConfirmation: undefined,
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
      <UFormField label="Old Password" name="oldPassword">
        <UInput v-model="state.oldPassword" autocomplete="current-password" placeholder="Old Password" type="password"/>
      </UFormField>
      <UFormField label="New Password" name="newPassword">
        <UInput v-model="state.newPassword" autocomplete="new-password" placeholder="New Password" type="password"/>
      </UFormField>
      <UFormField label="Confirm New Password" name="newPasswordConfirmation">
        <UInput v-model="state.newPasswordConfirmation" autocomplete="new-password" placeholder="Confirm New Password"
                type="password"/>
      </UFormField>

      <UButton type="submit">
        Update
      </UButton>
    </UForm>
  </UPageCard>
</template>

<style scoped>

</style>