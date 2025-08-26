<template>
  <v-app-bar
    v-if="isLoggedIn"
    :elevation="4"
    color="primary"
    dark
    class="gradient-primary"
  >
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold text-shadow">
      <v-icon class="mr-2" size="large">mdi-folder-multiple</v-icon>
      File Manager BRI
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme" class="mr-2" variant="text" size="large">
      <v-icon>{{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ isDark ? "Mode Terang" : "Mode Gelap" }}
      </v-tooltip>
    </v-btn>

    <v-btn icon class="mr-2" variant="text" size="large">
      <v-icon>mdi-bell</v-icon>
      <v-tooltip activator="parent" location="bottom"> Notifikasi </v-tooltip>
    </v-btn>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          v-bind="props"
          variant="text"
          size="large"
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
    isDark: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ["toggle-drawer", "toggle-theme", "logout"],
  methods: {
    toggleDrawer() {
      this.$emit("toggle-drawer");
    },
    toggleTheme() {
      this.$emit("toggle-theme");
    },
    handleLogout() {
      this.$emit("logout");
    },
  },
};
</script>

<style scoped>
.v-app-bar {
  backdrop-filter: blur(10px);
}
</style>
