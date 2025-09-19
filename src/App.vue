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
      :user="user"
      @toggle-drawer="drawer = !drawer"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-0">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component
              :is="Component"
              @login="handleLogin"
              @navigate="handleNavigate"
              @show-notification="showNotification"
            />
          </transition>
        </router-view>
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
    this.loadUserData();
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    handleLogin(userData) {
      this.user = userData;
      sessionStorage.setItem("user", JSON.stringify(userData));
      this.$router.push("/guide");
    },
    handleLogout() {
      sessionStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login");
    },
    handleNavigate(page) {
      this.$router.push(`/${page}`);
    },
    loadUserData() {
      const userData = sessionStorage.getItem("user");
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
/* Dynamic background based on theme */
.v-main {
  transition: background-color 0.3s ease;
}

:deep(.v-main) {
  background: rgb(var(--v-theme-background)) !important;
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
