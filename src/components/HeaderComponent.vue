<template>
  <v-app-bar
    v-if="isLoggedIn"
    :elevation="4"
    color="primary"
    class="header-bar gradient-primary"
  >
    <v-app-bar-nav-icon
      @click="toggleDrawer"
      color="rgba(255,255,255,0.9)"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold header-title text-shadow">
      <v-icon class="mr-2" color="rgba(255,255,255,0.9)">mdi-file-lock</v-icon>
      Secure File Transit
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn
      icon
      class="mr-2"
      variant="text"
      size="large"
      color="rgba(255,255,255,0.9)"
    >
      <v-icon color="rgba(255,255,255,0.9)">mdi-bell</v-icon>
      <v-tooltip activator="parent" location="bottom"> Notifikasi </v-tooltip>
    </v-btn>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          v-bind="props"
          variant="text"
          size="large"
          color="rgba(255,255,255,0.9)"
        ></v-btn>
      </template>
      <v-list min-width="200">
        <v-list-item prepend-icon="mdi-account" @click="">
          <v-list-item-title>{{ user?.name || "User" }}</v-list-item-title>
          <v-list-item-subtitle>{{
            user?.branch || "Cabang"
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-account-edit" @click="">
          <v-list-item-title>Edit Profil</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-cog" @click="">
          <v-list-item-title>Pengaturan</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          @click="handleLogout"
          class="text-red"
        >
          <v-list-item-title>Keluar</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ["toggle-drawer", "logout"],
  methods: {
    toggleDrawer() {
      this.$emit("toggle-drawer");
    },
    handleLogout() {
      this.$emit("logout");
    },
  },
};
</script>

<style scoped>
.header-bar {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.header-title {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
