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

    <!-- Inactivity Warning Dialog -->
    <v-dialog v-model="showInactivityWarning" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6 text-center pa-4">
          <v-icon color="warning" class="me-2">mdi-clock-alert</v-icon>
          Session Warning
        </v-card-title>

        <v-card-text class="text-center">
          <p class="mb-3">Your session will expire in:</p>
          <v-chip color="error" size="large" class="ma-2">
            <v-icon start>mdi-timer</v-icon>
            {{ warningCountdown }} seconds
          </v-chip>
          <p class="mt-3 text-body-2 text-medium-emphasis">
            Click "Extend Session" to continue or the session will automatically
            expire.
          </p>
        </v-card-text>

        <v-card-actions class="justify-center pa-4">
          <v-btn
            color="primary"
            variant="elevated"
            @click="extendSession"
            prepend-icon="mdi-refresh"
          >
            Extend Session
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import DrawerComponent from "./components/DrawerComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import authApi from "./services/authApi.js";

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
      showInactivityWarning: false,
      warningCountdown: 60,
      warningInterval: null,
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
    this.setupAutoLogout();
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    handleLogin(userData) {
      this.user = userData;
      sessionStorage.setItem("user", JSON.stringify(userData));
      // Start activity monitoring after successful login
      if (authApi.getAuthToken()) {
        authApi.startActivityMonitoring();
      }
      this.$router.push("/guide");
    },
    handleLogout() {
      sessionStorage.removeItem("user");
      this.user = null;
      authApi.stopActivityMonitoring();
      this.$router.push("/login");
    },
    handleNavigate(page) {
      this.$router.push(`/${page}`);
    },
    loadUserData() {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
        // Start activity monitoring if user is logged in and has token
        if (authApi.getAuthToken()) {
          console.log("User logged in, starting activity monitoring...");
          authApi.startActivityMonitoring();
        }
      } else {
        this.user = null;
      }
    },
    showNotification(message, type = "info") {
      this.snackbarText = message;
      this.snackbarColor = type;
      this.showSnackbar = true;
    },
    setupAutoLogout() {
      // Setup callbacks for auto logout
      authApi.setCallbacks(
        () => this.handleAutoLogout(),
        () => this.showInactivityWarningDialog()
      );
    },
    handleAutoLogout() {
      this.showInactivityWarning = false;
      if (this.warningInterval) {
        clearInterval(this.warningInterval);
        this.warningInterval = null;
      }
      this.user = null;
      this.showNotification(
        "Your session has expired due to inactivity",
        "warning"
      );
      this.handleLogout();
    },
    showInactivityWarningDialog() {
      this.showInactivityWarning = true;
      this.warningCountdown = 60;

      // Start countdown
      this.warningInterval = setInterval(() => {
        console.log(this.warningCountdown);
        this.warningCountdown--;
        if (this.warningCountdown <= 0) {
          this.extendSession(); // This will close the dialog
        }
      }, 1000);
    },
    extendSession() {
      this.showInactivityWarning = false;
      if (this.warningInterval) {
        clearInterval(this.warningInterval);
        this.warningInterval = null;
      }
      authApi.extendSession();
      this.showNotification("Session Extended", "success");
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
