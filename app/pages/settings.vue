<script setup lang="ts">
import UpdateUserInfoForm from "~/components/UpdateUserInfoForm.vue";
import ChangePasswordForm from "~/components/ChangePasswordForm.vue";

definePageMeta({
  middleware: "auth"
})

const runtimeConfig = useRuntimeConfig();

const {data: oidcStatus} = await useFetch("/api/oidc/status");
</script>

<template>
  <h2>Update User Info</h2>
  <UpdateUserInfoForm/>

  <h2>Change Password</h2>
  <ChangePasswordForm/>

  <template v-if="runtimeConfig.public.oidcDiscoveryURL">
    <h2 v-if="oidcStatus?.connected">Already connected to {{ runtimeConfig.public.oidcName ?? "OIDC" }}</h2>
    <template v-else>
      <h2>Connect to {{ runtimeConfig.public.oidcName ?? "OIDC" }}</h2>
      <UButton to="/api/oidc/login" external>Connect</UButton>
    </template>
  </template>
</template>

