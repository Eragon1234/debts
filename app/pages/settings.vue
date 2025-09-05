<script setup lang="ts">
import UpdateUserInfoForm from "~/components/UpdateUserInfoForm.vue";
import ChangePasswordForm from "~/components/ChangePasswordForm.vue";

definePageMeta({
  middleware: "auth"
})
</script>

<template>
  <h2>Update User Info</h2>
  <UpdateUserInfoForm/>

  <h2>Change Password</h2>
  <ChangePasswordForm/>
</template>

