<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-account-plus</v-icon>
          Tambah User Baru
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Kelola akun pengguna sistem dashboard cabang
        </p>
      </v-col>
    </v-row>

    <!-- Add User Form -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-account-plus</v-icon>
            Form Tambah User
          </v-card-title>
          <v-card-text class="pa-6">
            <v-form ref="userForm" v-model="formValid">
              <v-row>
                <!-- User Registration Information -->
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3 text-primary">
                    � Informasi User
                  </h3>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newUser.username"
                    label="Nama Pengguna"
                    prepend-inner-icon="mdi-account-circle"
                    variant="outlined"
                    density="comfortable"
                    :rules="usernameRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newUser.password"
                    label="Kata Sandi"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    density="comfortable"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="newUser.configId"
                    label="Config ID"
                    :items="configOptions"
                    prepend-inner-icon="mdi-cog"
                    variant="outlined"
                    density="comfortable"
                    :rules="[(v) => !!v || 'Config ID harus dipilih']"
                    required
                  ></v-select>
                </v-col>

                <!-- Action Buttons -->
                <v-col cols="12" class="d-flex justify-end gap-3 mt-4">
                  <v-btn
                    color="grey"
                    variant="outlined"
                    size="large"
                    @click="resetForm"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    Reset
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    @click="addUser"
                    :loading="saving"
                    :disabled="!formValid"
                    class="px-8"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Daftarkan Pengguna
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- User Statistics -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="mb-4">
          <v-card-title class="pb-2">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Statistik User
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-card
                  color="success"
                  variant="tonal"
                  class="text-center pa-3"
                >
                  <v-icon size="24" color="green-darken-2" class="mb-2"
                    >mdi-account-check</v-icon
                  >
                  <div class="text-h6 font-weight-bold text-green-darken-2">
                    124
                  </div>
                  <div class="text-caption text-green-darken-1">User Aktif</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card
                  color="warning"
                  variant="tonal"
                  class="text-center pa-3"
                >
                  <v-icon size="24" color="orange-darken-2" class="mb-2"
                    >mdi-account-clock</v-icon
                  >
                  <div class="text-h6 font-weight-bold text-orange-darken-2">
                    12
                  </div>
                  <div class="text-caption text-orange-darken-1">Pending</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card color="error" variant="tonal" class="text-center pa-3">
                  <v-icon size="24" color="red-darken-2" class="mb-2"
                    >mdi-account-off</v-icon
                  >
                  <div class="text-h6 font-weight-bold text-red-darken-2">
                    8
                  </div>
                  <div class="text-caption text-red-darken-1">Non-Aktif</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card color="info" variant="tonal" class="text-center pa-3">
                  <v-icon size="24" color="blue-darken-2" class="mb-2"
                    >mdi-account-multiple</v-icon
                  >
                  <div class="text-h6 font-weight-bold text-blue-darken-2">
                    144
                  </div>
                  <div class="text-caption text-blue-darken-1">Total User</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Recent Users -->
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="mr-2">mdi-clock</v-icon>
            User Terbaru
          </v-card-title>
          <v-card-text>
            <div
              v-for="user in recentUsers"
              :key="user.id"
              class="d-flex align-center mb-3"
            >
              <v-avatar size="32" color="blue-darken-2" class="mr-3">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="font-weight-medium text-grey-darken-3">
                  {{ user.name }}
                </div>
                <div class="text-caption text-grey-darken-2">
                  {{ user.role }}
                </div>
              </div>
              <v-chip
                size="x-small"
                :color="
                  user.status === 'active'
                    ? 'green-darken-2'
                    : 'orange-darken-2'
                "
              >
                {{ user.status }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Floating Alert -->
    <AlertComponent
      :message="alertMessage"
      :type="alertType"
      @close="alertMessage = ''"
    />
  </v-container>
</template>

<script>
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "AddUserComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      formValid: false,
      saving: false,
      showPassword: false,
      alertMessage: "",
      alertType: "success",
      newUser: {
        username: "",
        password: "",
        configId: null,
      },
      configOptions: [
        { title: "Config 1 - Standard User", value: 1 },
        { title: "Config 2 - Power User", value: 2 },
        { title: "Config 3 - Admin User", value: 3 },
        { title: "Config 4 - Guest User", value: 4 },
      ],
      recentUsers: [
        { id: 1, name: "Ahmad Rizki", role: "Staff", status: "active" },
        { id: 2, name: "Sari Dewi", role: "Manager", status: "active" },
        { id: 3, name: "Budi Santoso", role: "Operator", status: "pending" },
        { id: 4, name: "Maya Sari", role: "Staff", status: "active" },
      ],
      usernameRules: [
        (v) => !!v || "Username harus diisi",
        (v) => (v && v.length >= 3) || "Username minimal 3 karakter",
        (v) =>
          /^[a-zA-Z0-9_]+$/.test(v) ||
          "Username hanya boleh huruf, angka, dan underscore",
      ],
      passwordRules: [
        (v) => !!v || "Password harus diisi",
        (v) => (v && v.length >= 6) || "Password minimal 6 karakter",
      ],
    };
  },
  methods: {
    async addUser() {
      if (!this.$refs.userForm.validate()) {
        this.showAlert("Mohon lengkapi semua field yang diperlukan", "error");
        return;
      }

      this.saving = true;
      try {
        // Prepare data for API call sesuai dengan requirement
        const userData = {
          username: this.newUser.username,
          password: this.newUser.password,
          configId: this.newUser.configId,
        };

        console.log("Registering user:", userData);

        // Simulate API call to /auth/register
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.showAlert("User berhasil diregistrasi", "success");
        this.resetForm();
      } catch (error) {
        this.showAlert("Gagal meregistrasi user", "error");
      } finally {
        this.saving = false;
      }
    },

    resetForm() {
      this.newUser = {
        username: "",
        password: "",
        configId: null,
      };
      this.$refs.userForm.resetValidation();
    },

    showAlert(message, type = "success") {
      this.alertMessage = message;
      this.alertType = type;

      // Auto hide after 5 seconds
      setTimeout(() => {
        this.alertMessage = "";
      }, 5000);
    },
  },
};
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

/* Custom styling for better readability */
.v-card-text p {
  color: #1e293b;
}

.v-card-title {
  color: #1e293b !important;
}
</style>
