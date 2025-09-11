<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-account-group</v-icon>
          User List
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Manage and monitor system users
        </p>
      </v-col>
    </v-row>

    <!-- Combined Management Row: Left (List) - Right (Add User Form) -->
    <v-row>
      <!-- Users List Section -->
      <v-col cols="12" md="8">
        <!-- Search & Refresh -->
        <v-row class="mb-2">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchQuery"
              label="Search users..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              @input="searchUsers"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-end">
            <v-btn
              color="blue-darken-2"
              variant="outlined"
              block
              size="large"
              @click="refreshUsers"
              :loading="refreshing"
              prepend-icon="mdi-refresh"
              height="48px"
            >
              Refresh
            </v-btn>
          </v-col>
        </v-row>

        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2 d-flex align-center">
            <v-icon class="text-primary mr-2">mdi-account-group</v-icon>
            <span>User Data</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="primary" variant="tonal">
              {{ filteredUsers.length }} Users
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div v-if="loadingUsers" class="text-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <div class="text-subtitle-2 mt-4">Memuat data pengguna...</div>
            </div>

            <div
              v-else-if="filteredUsers.length === 0"
              class="text-center py-8"
            >
              <v-icon size="64" color="grey-lighten-2"
                >mdi-account-question</v-icon
              >
              <div class="text-h6 text-grey-darken-1 mt-4">
                {{
                  searchQuery
                    ? "Tidak ada pengguna yang sesuai dengan pencarian"
                    : "Belum ada data pengguna"
                }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mt-2">
                {{
                  searchQuery
                    ? "Coba ubah kata kunci pencarian"
                    : "Data pengguna akan dimuat dari API"
                }}
              </div>
            </div>

            <v-data-table
              v-else
              :headers="headers"
              :items="filteredUsers"
              :loading="loadingUsers"
              class="elevation-1 users-table"
              :items-per-page="10"
              :search="searchQuery"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar :color="getAvatarColor(item.username)" class="my-2">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.username) }}
                  </span>
                </v-avatar>
              </template>

              <template v-slot:item.id="{ item }">
                <div class="text-body-2 font-weight-medium">#{{ item.id }}</div>
              </template>

              <template v-slot:item.roles="{ item }">
                <v-chip
                  v-if="item.roles"
                  color="primary"
                  size="small"
                  variant="flat"
                  class="text-white font-weight-medium"
                >
                  {{ item.roles }}
                </v-chip>
                <span v-else class="text-grey-darken-1">-</span>
              </template>

              <template v-slot:item.configId="{ item }">
                <v-chip
                  v-if="item.configId"
                  color="orange"
                  size="small"
                  variant="outlined"
                  class="font-weight-medium"
                >
                  Config {{ item.configId }}
                </v-chip>
                <span v-else class="text-grey-darken-1">-</span>
              </template>

              <template v-slot:item.createdAt="{ item }">
                <div class="text-body-2">
                  {{ formatDate(item.createdAt) }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ formatTime(item.createdAt) }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add User Form Section -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="mb-4 add-user-card">
          <v-card-title class="pb-2 d-flex align-center">
            <v-icon class="text-primary mr-2">mdi-account-plus</v-icon>
            <span>Tambah Pengguna</span>
          </v-card-title>
          <v-card-text class="pt-2">
            <v-form ref="userForm" v-model="formValid">
              <v-text-field
                v-model="newUser.username"
                label="Nama Pengguna"
                prepend-inner-icon="mdi-account-circle"
                variant="outlined"
                density="comfortable"
                :rules="usernameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.password"
                label="Kata Sandi"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                density="comfortable"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-select
                v-model="newUser.configId"
                label="Config ID"
                :items="configOptions"
                item-title="title"
                item-value="value"
                prepend-inner-icon="mdi-cog"
                append-inner-icon="mdi-refresh"
                @click:append-inner="fetchConfigs"
                variant="outlined"
                density="comfortable"
                :loading="loadingConfigs"
                :disabled="loadingConfigs"
                :rules="[(v) => !!v || 'Config ID harus dipilih']"
                required
              ></v-select>
              <div class="d-flex justify-end mt-2">
                <v-btn
                  color="grey"
                  variant="outlined"
                  size="large"
                  class="me-3"
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
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Simpan
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Optional quick info -->
        <v-card elevation="1" rounded="lg" variant="tonal" color="info">
          <v-card-text class="py-4 text-caption">
            <v-icon size="18" class="mr-1" color="info">mdi-information</v-icon>
            Gunakan form ini untuk menambahkan user baru dan tabel di kiri untuk
            memantau.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Alerts -->
    <AlertComponent :message="alertMessage" :type="alertType" />
  </v-container>
</template>

<script>
import ApiService from "../services/api.js";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "Users",
  components: {
    AlertComponent,
  },
  data() {
    return {
      users: [],
      filteredUsers: [],
      loadingUsers: false,
      refreshing: false,
      searchQuery: "",
      alertMessage: "",
      alertType: "success",
      // Add user form state
      formValid: false,
      saving: false,
      showPassword: false,
      loadingConfigs: false,
      newUser: { username: "", password: "", configId: null },
      configOptions: [],
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
      headers: [
        { title: "", key: "avatar", sortable: false, width: "60px" },
        { title: "ID", key: "id", sortable: true, width: "80px" },
        { title: "Nama Pengguna", key: "username", sortable: true },
        { title: "Peran", key: "roles", sortable: true },
        { title: "Config ID", key: "configId", sortable: true },
        { title: "Dibuat", key: "createdAt", sortable: true },
      ],
    };
  },
  async addUser() {
    if (!this.$refs.userForm.validate()) {
      this.showAlert("Mohon lengkapi semua field yang diperlukan", "error");
      return;
    }
    this.saving = true;
    try {
      const userData = {
        username: this.newUser.username,
        password: this.newUser.password,
        configId: this.newUser.configId,
      };
      // Simulate API call (replace with real API later)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.showAlert("User berhasil diregistrasi", "success");
      this.resetForm();
      // Optionally refresh list
      this.refreshUsers();
    } catch (e) {
      this.showAlert("Gagal meregistrasi user", "error");
    } finally {
      this.saving = false;
    }
  },
  resetForm() {
    this.newUser = { username: "", password: "", configId: null };
    this.$refs.userForm.resetValidation();
  },
  methods: {
    async fetchUsers() {
      this.loadingUsers = true;
      try {
        console.log("Fetching users...");
        const response = await ApiService.getUsers();
        console.log("Users response:", response);

        // Handle response berdasarkan struktur API
        this.users = Array.isArray(response) ? response : response.data || [];
        this.filteredUsers = [...this.users];

        console.log("Users loaded successfully:", this.users.length, "items");
      } catch (error) {
        console.error("Error fetching users:", error);
        this.showAlert("Gagal memuat daftar pengguna", "error");
        this.users = [];
        this.filteredUsers = [];
      } finally {
        this.loadingUsers = false;
      }
    },

    async refreshUsers() {
      this.refreshing = true;
      try {
        await this.fetchUsers();
        this.showAlert("Daftar pengguna berhasil diperbarui", "success");
      } catch (error) {
        this.showAlert("Gagal memperbarui daftar pengguna", "error");
      } finally {
        this.refreshing = false;
      }
    },

    async fetchConfigs() {
      this.loadingConfigs = true;
      try {
        console.log("Fetching configs...");
        const response = await ApiService.getConfig();
        console.log("Configs response:", response);

        // Handle array response from API
        const configs = Array.isArray(response)
          ? response
          : response.data || [];

        // Transform configs to match v-select format
        this.configOptions = configs.map((config) => ({
          title: `Config ${config.configId} - ${
            config.region || config.code || "No description"
          }`,
          value: config.configId,
        }));

        console.log(
          "Configs loaded successfully:",
          this.configOptions.length,
          "items"
        );

        if (this.configOptions.length === 0) {
          this.showAlert("Tidak ada konfigurasi yang tersedia", "warning");
        }
      } catch (error) {
        console.error("Error fetching configs:", error);
        this.showAlert("Gagal memuat daftar konfigurasi", "error");
        this.configOptions = [];
      } finally {
        this.loadingConfigs = false;
      }
    },

    searchUsers() {
      let filtered = [...this.users];

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.username.toLowerCase().includes(query) ||
            (user.id && user.id.toString().includes(query))
        );
      }

      this.filteredUsers = filtered;
    },

    getInitials(username) {
      if (!username) return "?";
      const names = username.split(" ");
      if (names.length >= 2) {
        return (
          names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
        );
      }
      return (
        username.charAt(0).toUpperCase() +
        (username.charAt(1) || "").toUpperCase()
      );
    },

    getAvatarColor(username) {
      const colors = [
        "blue",
        "green",
        "orange",
        "purple",
        "red",
        "teal",
        "indigo",
        "pink",
      ];
      const index = username.charCodeAt(0) % colors.length;
      return colors[index];
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return "Format tanggal tidak valid";
      }
    },

    formatTime(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hari ini";
        if (diffDays === 1) return "Kemarin";
        if (diffDays < 7) return `${diffDays} hari lalu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
        return `${Math.floor(diffDays / 365)} tahun lalu`;
      } catch (error) {
        return "";
      }
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
  mounted() {
    // Fetch initial data
    this.fetchUsers();
    this.fetchConfigs();
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-chip {
  font-size: 12px;
}

.add-user-card :deep(.v-text-field),
.add-user-card :deep(.v-select) {
  margin-bottom: 12px;
}

.users-table {
  max-height: 650px;
}

.add-user-card {
  position: sticky;
  top: 16px;
}

.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:deep(.v-input__details) {
  display: none;
}
</style>
