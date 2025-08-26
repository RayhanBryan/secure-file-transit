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
                  label="Username / NIP"
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
                  label="Password"
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
                    Lupa Password?
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
                  <v-icon left>mdi-login</v-icon>
                  Masuk
                </v-btn>

                <!-- Error Alert -->
                <v-alert
                  v-if="loginError"
                  type="error"
                  variant="tonal"
                  class="mt-4"
                  rounded="lg"
                >
                  {{ loginError }}
                </v-alert>
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
              <p class="text-caption text-grey-darken-1">
                Hubungi IT Support: ext. 1234 atau it-support@bri.co.id
              </p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="text-h5 pa-6 bg-grey-lighten-4">
          <v-icon left color="primary">mdi-lock-reset</v-icon>
          Reset Password
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Masukkan username atau email Anda untuk mendapatkan link reset
            password.
          </p>

          <v-text-field
            v-model="resetEmail"
            label="Username / Email"
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
            Kirim Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  emits: ["login"],
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
        (v) => !!v || "Username wajib diisi",
        (v) => v.length >= 3 || "Username minimal 3 karakter",
      ],
      passwordRules: [
        (v) => !!v || "Password wajib diisi",
        (v) => v.length >= 4 || "Password minimal 4 karakter",
      ],
    };
  },
  methods: {
    // Login handler
    async handleLogin() {
      // Clear previous errors
      this.loginError = "";
      this.errors.username = [];
      this.errors.password = [];

      // Basic validation
      if (!this.form.username) {
        this.errors.username = ["Username wajib diisi"];
        return;
      }
      if (!this.form.password) {
        this.errors.password = ["Password wajib diisi"];
        return;
      }

      this.loading = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Demo credentials
        if (this.form.username === "admin" && this.form.password === "admin") {
          // Success - emit login event
          this.$emit("login", {
            username: this.form.username,
            name: "Administrator",
            role: "admin",
            branch: "Cabang Utama Jakarta",
          });
        } else if (
          this.form.username === "user" &&
          this.form.password === "user"
        ) {
          // Success - emit login event
          this.$emit("login", {
            username: this.form.username,
            name: "User BRI",
            role: "user",
            branch: "Cabang Jakarta Selatan",
          });
        } else {
          this.loginError =
            "Username atau password salah. Coba gunakan admin/admin atau user/user";
        }
      } catch (error) {
        this.loginError = "Terjadi kesalahan saat login. Silakan coba lagi.";
      } finally {
        this.loading = false;
      }
    },

    // Forgot password handler
    async handleForgotPassword() {
      if (!this.resetEmail) return;

      this.resetLoading = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success message
        alert("Link reset password telah dikirim ke email Anda!");
        this.showForgotPassword = false;
        this.resetEmail = "";
      } catch (error) {
        alert("Terjadi kesalahan. Silakan coba lagi.");
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
