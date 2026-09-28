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
  <div class="flex flex-col gap-4">
    <UpdateUserInfoForm/>

    <ChangePasswordForm/>

    <UPageCard v-if="runtimeConfig.public.oidcDiscoveryURL"
               :title="`Connect to ${ runtimeConfig.public.oidcName ?? 'OIDC' }`"
               variant="subtle">
      <p v-if="oidcStatus?.connected" class="text-lg">Already connected!</p>
      <UButton v-else class="text-lg" external to="/api/public/oidc/login">Connect</UButton>
    </UPageCard>
  </div>
</template>

