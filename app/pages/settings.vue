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
  <UpdateUserInfoForm/>

  <ChangePasswordForm/>

  <UPageCard v-if="runtimeConfig.public.oidcDiscoveryURL"
             title="Connect to {{ runtimeConfig.public.oidcName ?? 'OIDC' }}">
    <p v-if="oidcStatus?.connected" class="text-lg">Already connected!</p>
    <UButton v-else to="/api/oidc/login" external class="text-lg">Connect</UButton>
  </UPageCard>
</template>

