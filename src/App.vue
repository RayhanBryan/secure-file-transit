<template>
  <v-app>
    <!-- Navigation Drawer Component -->
    <DrawerComponent
      :is-logged-in="isLoggedIn"
      :drawer="drawer"
      :rail="rail"
      :user-menus="userMenus"
      @update:drawer="drawer = $event"
    />

    <!-- Header Component -->
    <HeaderComponent
      :is-logged-in="isLoggedIn"
      :is-dark="isDark"
      :user="user"
      @toggle-drawer="drawer = !drawer"
      @toggle-theme="toggleTheme"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-0">
        <transition name="fade" mode="out-in">
          <router-view
            @login="handleLogin"
            @navigate="handleNavigate"
            @show-notification="showNotification"
          />
        </transition>
      </v-container>
    </v-main>

    <!-- Footer Component -->
    <FooterComponent :is-logged-in="isLoggedIn" />

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
      :color="snackbarColor"
      top
      right
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSnackbar = false">
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { useTheme } from "vuetify";
import HeaderComponent from "./components/HeaderComponent.vue";
import DrawerComponent from "./components/DrawerComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    DrawerComponent,
    FooterComponent,
  },
  data() {
    return {
      drawer: true,
      rail: false,
      user: null,
      showSnackbar: false,
      snackbarText: "",
      snackbarColor: "info",
    };
  },
  computed: {
    isDark() {
      return this.theme.global.name.value === "dark";
    },
    isLoggedIn() {
      return this.user !== null;
    },
    userMenus() {
      // Ensure we always return an array, never null or undefined
      if (!this.user || !Array.isArray(this.user.menus)) {
        return [];
      }
      return this.user.menus;
    },
  },
  watch: {
    "$route.path": {
      handler(newPath) {
        this.loadUserData();
      },
      immediate: true,
    },
  },
  created() {
    this.theme = useTheme();
    this.loadUserData();
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    toggleTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark
        ? "light"
        : "dark";
    },
    handleLogin(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      this.$router.push("/bridrive");
    },
    handleLogout() {
      localStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login");
    },
    handleNavigate(page) {
      this.$router.push(`/${page}`);
    },
    loadUserData() {
      const userData = localStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        this.user = null;
      }
    },
    showNotification(message, type = "info") {
      this.snackbarText = message;
      this.snackbarColor = type;
      this.showSnackbar = true;
    },
  },
};
</script>

<style scoped>
.v-main {
  background: #f5f7fa;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
