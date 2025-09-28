<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import {patchUserSchema} from "#shared/schemas/PatchUserSchema";

const {user} = getUserSession();

type Schema = z.output<typeof patchUserSchema>

const state = reactive({
  name: user!.name,
  username: user!.username,
})

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch(`/api/users/${user!.id}`, {
    method: "PATCH",
    body: event.data
  }).then(() => {
    toast.add({
      title: "Success",
      description: "User updated"
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
  <UForm :schema="patchUserSchema" :state="state" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="state.name"/>
    </UFormField>

    <UFormField label="Username" name="username">
      <UInput v-model="state.username"/>
    </UFormField>

    <UButton type="submit">
      Update
    </UButton>
  </UForm>
</template>

<style scoped>

</style>