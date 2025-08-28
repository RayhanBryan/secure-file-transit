<template>
  <v-app>
    <!-- Navigation Drawer - Only show when logged in -->
    <v-navigation-drawer
      v-if="isLoggedIn"
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      color="grey-lighten-5"
      class="border-e"
    >
      <v-list-item
        prepend-icon="mdi-bank"
        :title="rail ? '' : 'Dashboard Cabang'"
        :subtitle="rail ? '' : 'BRI Management System'"
        nav
        class="px-4 py-3"
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
            size="small"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list density="compact" nav class="px-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          @click="$router.push('/')"
          class="mb-1"
          rounded="lg"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-information"
          title="About"
          value="about"
          @click="$router.push('/about')"
          class="mb-1"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <!-- App Bar - Only show when logged in -->
    <v-app-bar
      v-if="isLoggedIn"
      :elevation="4"
      color="primary"
      dark
      class="gradient-primary"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold text-shadow">
        <v-icon class="mr-2" size="large">mdi-bank</v-icon>
        Dashboard Cabang BRI
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme" class="mr-2" variant="text" size="large">
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
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

    <!-- Main Content -->
    <v-main :class="$route.name === 'About' ? 'about-main' : 'default-main'">
      <div class="main-content-wrapper">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-main>

    <!-- Footer - Only show when logged in and not on About page -->
    <v-footer
      v-if="isLoggedIn && $route.name !== 'About'"
      class="text-center gradient-primary"
      color="primary"
      app
      height="60"
    >
      <div
        class="text-white text-shadow d-flex align-center justify-center w-100"
      >
        <v-icon class="mr-2">mdi-copyright</v-icon>
        {{ new Date().getFullYear() }} - Dashboard Cabang BRI.
        <span class="ml-1 font-weight-medium">
          Built with Vue 3 + Vuetify 3
        </span>
        <v-icon class="ml-2 text-red">mdi-heart</v-icon>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useTheme } from "vuetify";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const theme = useTheme();
const drawer = ref(true);
const rail = ref(false);
const user = ref(null);

const isDark = computed(() => theme.global.name.value === "dark");

// Check if user is logged in
const isLoggedIn = computed(() => {
  return user.value !== null && route.path !== "/login";
});

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const handleLogout = () => {
  // Clear user data
  localStorage.removeItem("user");
  user.value = null;

  // Redirect to login
  router.push("/login");
};

const loadUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  } else {
    user.value = null;
  }
};

onMounted(() => {
  loadUserData();
});

// Watch for route changes to reload user data
watch(
  () => route.path,
  () => {
    loadUserData();
  }
);
</script>

<style scoped>
.v-app-bar {
  backdrop-filter: blur(10px);
}

.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.main-content-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Different styles for About page vs other pages */
.about-main {
  padding: 0 !important;
  min-height: 100vh !important;
}

.about-main .main-content-wrapper {
  min-height: 100vh;
}

.default-main {
  background: #f5f7fa;
  padding: 24px;
  min-height: calc(100vh - 64px - 60px); /* Minus app bar and footer */
}

/* For About page - no background */
:deep(.about-page-full) {
  background: transparent;
  min-height: 100vh;
}

/* Remove any default Vuetify padding for About page */
.about-main :deep(.v-main__wrap) {
  padding: 0 !important;
}
</style>
