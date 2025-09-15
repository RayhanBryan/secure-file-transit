<template>
  <v-footer
    v-if="isLoggedIn"
    class="text-center gradient-primary"
    color="primary"
    app
    height="60"
  >
    <div
      class="text-white text-shadow d-flex align-center justify-center w-100"
    >
      <v-icon class="mr-2">mdi-copyright</v-icon>
      {{ new Date().getFullYear() }} - Secure File Transit System.
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "FooterComponent",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Add any footer-specific styles here */
</style>
