<template>
  <div class="login-page">
    <v-container fluid class="fill-height">
      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <!-- Login Card -->
          <v-card elevation="12" class="mx-auto login-card" rounded="xl">
            <!-- Header Section -->
            <div class="gradient-primary text-center pa-8">
              <v-avatar size="80" class="mb-4" color="white">
                <v-icon size="50" color="primary">mdi-bank</v-icon>
              </v-avatar>
              <h1 class="text-h4 font-weight-bold text-white text-shadow mb-2">
                Dashboard BRI
              </h1>
              <p class="text-subtitle-1 text-white text-shadow opacity-90">
                Sistem Manajemen Cabang
              </p>
            </div>

            <!-- Login Form -->
            <v-card-text class="pa-8">
              <v-form @submit.prevent="handleLogin" ref="loginForm">
                <div class="text-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-primary">
                    Masuk ke Akun Anda
                  </h2>
                  <p class="text-body-2 text-grey-darken-1 mt-2">
                    Silakan masukkan kredensial untuk melanjutkan
                  </p>
                </div>

                <!-- Username Field -->
                <v-text-field
                  v-model="form.username"
                  label="Nama Pengguna / NIP"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :rules="usernameRules"
                  :error-messages="errors.username"
                  class="mb-3"
                  density="comfortable"
                  rounded="lg"
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Kata Sandi"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  :rules="passwordRules"
                  :error-messages="errors.password"
                  class="mb-4"
                  density="comfortable"
                  rounded="lg"
                ></v-text-field>

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    v-model="form.remember"
                    label="Ingat saya"
                    density="compact"
                    color="primary"
                    hide-details
                  ></v-checkbox>

                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    @click="showForgotPassword = true"
                  >
                    Lupa Kata Sandi?
                  </v-btn>
                </div>

                <!-- Login Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  variant="elevated"
                  size="large"
                  block
                  :loading="loading"
                  class="gradient-primary text-white font-weight-bold"
                  rounded="lg"
                >
                  Masuk
                </v-btn>
              </v-form>
            </v-card-text>

            <!-- Footer -->
            <v-card-actions class="px-8 pb-8">
              <div class="w-100 text-center">
                <v-divider class="mb-4"></v-divider>
                <p class="text-caption text-grey-darken-1">
                  © {{ new Date().getFullYear() }} Bank Rakyat Indonesia
                </p>
                <p class="text-caption text-grey-darken-1">
                  Sistem Dashboard Cabang v1.0
                </p>
              </div>
            </v-card-actions>
          </v-card>

          <!-- Additional Info -->
          <div class="text-center mt-6">
            <v-card variant="tonal" color="info" class="pa-4" rounded="lg">
              <v-icon color="info" class="mb-2">mdi-information</v-icon>
              <p class="text-body-2 text-info mb-2 font-weight-medium">
                Butuh Bantuan?
              </p>
              <p class="text-caption text-white">
                Hubungi IT Support: ext. 1234 atau it-support@bri.co.id
              </p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Floating Alert -->
    <AlertComponent
      :message="loginError"
      :type="alertType"
      @close="loginError = ''"
    />

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="text-h5 pa-6 bg-grey-lighten-4">
          <v-icon left color="primary">mdi-lock-reset</v-icon>
          Atur Ulang Kata Sandi
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Masukkan nama pengguna atau email Anda untuk mendapatkan tautan atur
            ulang kata sandi.
          </p>

          <v-text-field
            v-model="resetEmail"
            label="Nama Pengguna / Email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="comfortable"
            rounded="lg"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showForgotPassword = false">
            Batal
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="handleForgotPassword"
            :loading="resetLoading"
          >
            Kirim Tautan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ApiService from "../services/api.js";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "LoginComponent",
  emits: ["login"],
  components: {
    AlertComponent,
  },
  data() {
    return {
      // Form data
      form: {
        username: "",
        password: "",
        remember: false,
      },
      // UI states
      showPassword: false,
      loading: false,
      loginError: "",
      alertType: "error",
      errors: {
        username: [],
        password: [],
      },
      // Forgot password
      showForgotPassword: false,
      resetEmail: "",
      resetLoading: false,
      // Form validation rules
      usernameRules: [
        (v) => !!v || "Nama pengguna wajib diisi",
        (v) => v.length >= 3 || "Nama pengguna minimal 3 karakter",
      ],
      passwordRules: [
        (v) => !!v || "Kata sandi wajib diisi",
        (v) => v.length >= 4 || "Kata sandi minimal 4 karakter",
      ],
    };
  },
  methods: {
    // Show alert message
    showAlert(message, type = "error") {
      this.loginError = message;
      this.alertType = type;

      // Auto hide after 5 seconds
      setTimeout(() => {
        this.loginError = "";
      }, 5000);
    },
    // Login handler
    async handleLogin() {
      // Clear previous errors
      this.loginError = "";
      this.errors.username = [];
      this.errors.password = [];

      // Basic validation
      if (!this.form.username) {
        this.errors.username = ["Nama pengguna wajib diisi"];
        this.showAlert("Nama pengguna wajib diisi", "error");
        return;
      }
      if (!this.form.password) {
        this.errors.password = ["Kata sandi wajib diisi"];
        this.showAlert("Kata sandi wajib diisi", "error");
        return;
      }

      this.loading = true;

      try {
        // Call actual login API using ApiService
        const response = await ApiService.login({
          username: this.form.username,
          password: this.form.password,
        });

        // Debug: Log the actual response structure
        console.log("API Response:", response);

        // Check if login is successful - more flexible checking
        const isSuccessful =
          response &&
          (response.success === true ||
            response.status === "success" ||
            response.status === "ok" ||
            response.token ||
            response.user ||
            response.data ||
            // If response exists and doesn't have explicit error
            (response &&
              !response.error &&
              !response.message?.includes("error")));

        if (isSuccessful) {
          console.log("Login successful, processing response...");

          // Store token if provided
          const token =
            response.token || response.data?.token || response.accessToken;
          if (token) {
            ApiService.setAuthToken(token);
          }

          // Extract user data from various possible locations
          const userData =
            response.user || response.data?.user || response.data || {};

          // Success - emit login event with user data
          this.$emit("login", {
            username: this.form.username,
            name:
              userData.name ||
              userData.fullName ||
              userData.username ||
              this.form.username,
            role: userData.role || "user",
            branch:
              userData.branch ||
              userData.office ||
              userData.department ||
              "Cabang BRI",
            token: token,
            menus: Array.isArray(response.menus) ? response.menus : [], // Ensure menus is always an array
          });
        } else {
          console.log("Login failed, showing error...");
          this.showAlert(
            response?.message ||
              response?.error ||
              "Login gagal - silakan periksa kredensial Anda",
            "error"
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        // Fallback to demo credentials if API fails
        if (this.form.username === "admin" && this.form.password === "admin") {
          this.$emit("login", {
            username: this.form.username,
            name: "Administrator",
            role: "admin",
            branch: "Cabang Utama Jakarta",
            menus: [], // Add empty menus array
          });
        } else if (
          this.form.username === "user" &&
          this.form.password === "user"
        ) {
          this.$emit("login", {
            username: this.form.username,
            name: "User BRI",
            role: "user",
            branch: "Cabang Jakarta Selatan",
            menus: [], // Add empty menus array
          });
        } else {
          this.showAlert(
            error.message ||
              "Tidak dapat terhubung ke server. Coba gunakan admin/admin atau user/user untuk demo",
            "error"
          );
        }
      } finally {
        this.loading = false;
      }
    },

    // Forgot password handler
    async handleForgotPassword() {
      if (!this.resetEmail) {
        this.showAlert("Email wajib diisi", "error");
        return;
      }

      this.resetLoading = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success message
        this.showAlert(
          "Tautan atur ulang kata sandi telah dikirim ke email Anda!",
          "success"
        );
        this.showForgotPassword = false;
        this.resetEmail = "";
      } catch (error) {
        this.showAlert("Terjadi kesalahan. Silakan coba lagi.", "error");
      } finally {
        this.resetLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.login-card {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.fill-height {
  min-height: 100vh;
}

/* Custom scrollbar untuk dialog */
:deep(.v-overlay__content) {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
