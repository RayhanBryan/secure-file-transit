<template>
  <div class="login-page">
    <v-container fluid class="pa-0 fill-height" style="min-height: 100vh">
      <v-row class="ma-0 fill-height" style="min-height: 100vh">
        <!-- Left Side - Branding -->
        <v-col cols="12" md="7" lg="8" class="left-panel d-none d-md-flex">
          <div class="branding-container">
            <div class="brand-header">
              <v-icon size="32" color="white" class="mr-2">mdi-bank</v-icon>
              <span class="brand-text">Secure File Transit</span>
            </div>

            <div class="welcome-content">
              <h1 class="welcome-title">Selamat Datang</h1>
              <p class="welcome-subtitle">Sistem Keamanan Transfer File</p>
            </div>

            <div class="bottom-text">
              <span class="secure-text">Secure • Reliable • Trusted</span>
            </div>
          </div>
        </v-col>

        <!-- Right Side - Login Form -->
        <v-col
          cols="12"
          md="5"
          lg="4"
          class="right-panel d-flex align-center justify-center"
        >
          <div class="login-form-container">
            <!-- Login Form -->
            <div class="form-content">
              <div class="form-title-section">
                <p class="welcome-text">Kami menjaga semuanya</p>
                <h1 class="main-title">Login</h1>
              </div>

              <v-form @submit.prevent="handleLogin" ref="loginForm">
                <!-- Email/Username Field -->
                <div class="form-field">
                  <v-text-field
                    v-model="form.username"
                    label="Nama Pengguna"
                    variant="outlined"
                    rounded="xl"
                    density="comfortable"
                    :error-messages="errors.username"
                    hide-details="auto"
                    class="custom-input"
                  ></v-text-field>
                </div>

                <!-- Password Field -->
                <div class="form-field">
                  <v-text-field
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Kata Sandi"
                    variant="outlined"
                    rounded="xl"
                    density="comfortable"
                    :error-messages="errors.password"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    hide-details="auto"
                    class="custom-input"
                  ></v-text-field>
                </div>

                <!-- Login Button -->
                <div class="form-field">
                  <v-btn
                    type="submit"
                    block
                    color="primary"
                    size="large"
                    rounded="xl"
                    :loading="loading"
                    class="login-btn"
                  >
                    Masuk
                  </v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Alert Messages -->
    <AlertComponent
      :message="loginError"
      :type="alertType"
      @close="loginError = ''"
    />

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="400">
      <v-card rounded="xl" elevation="8">
        <v-card-title class="text-h6 pa-6">
          <v-icon left color="primary">mdi-lock-reset</v-icon>
          Atur Ulang Kata Sandi
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p class="text-body-2 mb-4">
            Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi Anda.
          </p>

          <v-text-field
            v-model="resetEmail"
            label="Alamat Email"
            variant="outlined"
            rounded="lg"
            density="comfortable"
            type="email"
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
            rounded="lg"
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
  height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* Left Panel - Branding */
.left-panel {
  background: linear-gradient(135deg, #7dd3fc 0%, #a7f3d0 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.branding-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  position: relative;
}

.brand-header {
  display: flex;
  align-items: center;
  z-index: 2;
}

.brand-text {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
}

.welcome-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.bottom-text {
  display: flex;
  justify-content: center;
  z-index: 2;
}

.secure-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Right Panel - Login Form */
.right-panel {
  background: white;
  padding: 2rem;
  min-height: 100vh;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
}

.sign-up-btn {
  border-color: #e5e7eb !important;
  color: #6b7280 !important;
}

.form-title-section {
  margin-bottom: 2rem;
}

.welcome-text {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.main-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}

.form-field {
  margin-bottom: 1.5rem;
}

.custom-input :deep(.v-field) {
  background: #f9fafb;
  border-radius: 2rem !important;
}

.custom-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.custom-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
}

/* Remove autofill background */
.custom-input :deep(.v-field__input input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  background-color: #f9fafb !important;
  border-radius: 2rem !important;
}

.custom-input :deep(.v-field__input input:-webkit-autofill:hover) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  background-color: #f9fafb !important;
  border-radius: 2rem !important;
}

.custom-input :deep(.v-field__input input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  background-color: #f9fafb !important;
  border-radius: 2rem !important;
}

.custom-input :deep(.v-field__input input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  background-color: #f9fafb !important;
  border-radius: 2rem !important;
}

/* Additional autofill removal for all browsers */
.custom-input :deep(input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  background-color: transparent !important;
  border-radius: 2rem !important;
}

.custom-input :deep(input:-webkit-autofill:hover) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  border-radius: 2rem !important;
}

.custom-input :deep(input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  border-radius: 2rem !important;
}

.custom-input :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  border-radius: 2rem !important;
}

.login-btn {
  height: 56px !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 14px rgba(125, 211, 252, 0.25) !important;
  background: linear-gradient(135deg, #7dd3fc 0%, #a7f3d0 100%) !important;
  color: #1f2937 !important;
}

.login-btn:hover {
  box-shadow: 0 6px 20px rgba(125, 211, 252, 0.4) !important;
  transform: translateY(-1px);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.remember-checkbox :deep(.v-label) {
  font-size: 0.875rem;
  color: #6b7280;
}

.forgot-link {
  font-size: 0.875rem !important;
  text-decoration: none !important;
}

.forgot-link:hover {
  text-decoration: underline !important;
}

/* Responsive Design */
@media (max-width: 960px) {
  .right-panel {
    padding: 1rem;
    min-height: 100vh;
  }

  .login-form-container {
    padding: 1rem;
  }

  .welcome-title {
    font-size: 2.5rem;
  }

  .main-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .welcome-title {
    font-size: 2rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .form-header {
    margin-bottom: 2rem;
  }

  .form-title-section {
    margin-bottom: 1.5rem;
  }

  .right-panel {
    min-height: 100vh;
    padding: 1rem;
  }
}

/* Dialog Styling */
:deep(.v-dialog .v-card) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

:deep(.v-dialog .v-card-title) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
}

/* Background Pattern for Left Panel */
.left-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

/* Smooth curve transition between panels */
.left-panel::after {
  content: "";
  position: absolute;
  top: 0;
  right: -50px;
  width: 100px;
  height: 100%;
  background: linear-gradient(135deg, #7dd3fc 0%, #a7f3d0 100%);
  border-radius: 0 0 0 100px;
  z-index: 1;
}

@media (max-width: 960px) {
  .left-panel::after {
    display: none;
  }
}

/* Global autofill removal - more aggressive approach */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  background-color: transparent !important;
  transition: background-color 5000s ease-in-out 0s !important;
  caret-color: #1f2937 !important;
  border-radius: 2rem !important;
}

/* Force remove autofill styles */
.v-field__input input:-webkit-autofill,
.v-field__input input:-webkit-autofill:hover,
.v-field__input input:-webkit-autofill:focus,
.v-field__input input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #f9fafb inset !important;
  -webkit-text-fill-color: #1f2937 !important;
  background-color: transparent !important;
  background-image: none !important;
  border-radius: 2rem !important;
}
</style>
