<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-account-group</v-icon>
          Daftar Pengguna
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Kelola dan pantau daftar pengguna sistem
        </p>
      </v-col>
    </v-row>

    <!-- Search and Filter -->
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          label="Cari pengguna..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          @input="searchUsers"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          color="blue-darken-2"
          variant="outlined"
          size="large"
          @click="refreshUsers"
          :loading="refreshing"
          prepend-icon="mdi-refresh"
          height="48px"
        >
          Perbarui Daftar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Users List -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-row>
              <v-col cols="6">
                <v-icon class="text-primary mr-2">mdi-account-group</v-icon>
                Data Pengguna
              </v-col>
            </v-row>
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
              class="elevation-1"
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
    </v-row>

    <!-- Success/Error Alerts -->
    <AlertComponent :message="alertMessage" :type="alertType" />
  </v-container>
</template>

<script>
import ApiService from "../services/api.js";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "GetUsersComponent",
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
    // Fetch initial users data
    this.fetchUsers();
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

.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:deep(.v-input__details) {
  display: none;
}
</style>
