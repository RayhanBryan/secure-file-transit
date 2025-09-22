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
              <div class="text-subtitle-2 mt-4">Loading user data...</div>
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
                    ? "No users match the search criteria"
                    : "No user data available"
                }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mt-2">
                {{
                  searchQuery
                    ? "Try changing the search keywords"
                    : "User data will be loaded from API"
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
              <template v-slot:header.configId>
                <span>Config ID</span>
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  color="primary"
                  @click="toggleAllConfigDetails"
                >
                  <v-icon size="16">
                    {{
                      expandedRows.length === filteredUsers.length &&
                      filteredUsers.length > 0
                        ? "mdi-eye-off"
                        : "mdi-eye"
                    }}
                  </v-icon>
                </v-btn>
              </template>
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
                <div class="config-cell">
                  <div class="d-flex align-center mb-1">
                    <v-chip
                      color="orange"
                      size="small"
                      variant="outlined"
                      class="font-weight-medium me-2"
                    >
                      Config {{ item.configId }}
                    </v-chip>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="toggleConfigDetails(item.id, item.configId)"
                      class="config-view-btn"
                    >
                      <v-icon size="18">
                        {{
                          expandedRows.includes(item.id)
                            ? "mdi-eye-off"
                            : "mdi-eye"
                        }}
                      </v-icon>
                    </v-btn>
                  </div>

                  <!-- Expanded config details -->
                  <v-expand-transition>
                    <div
                      v-if="expandedRows.includes(item.id)"
                      class="config-details my-2"
                    >
                      <div
                        v-if="configDetailsCache[item.id]"
                        class="config-info"
                      >
                        <div class="text-caption mb-1">
                          <v-icon size="12" color="primary" class="me-1"
                            >mdi-map-marker</v-icon
                          >
                          <strong>Region:</strong>
                          {{ configDetailsCache[item.id].region || "N/A" }}
                        </div>
                        <div class="text-caption">
                          <v-icon size="12" color="primary" class="me-1"
                            >mdi-code-tags</v-icon
                          >
                          <strong>Code:</strong>
                          {{ configDetailsCache[item.id].code || "N/A" }}
                        </div>
                      </div>

                      <div v-else class="text-caption text-error">
                        <v-icon size="12" class="me-1">mdi-alert-circle</v-icon>
                        Config details not available
                      </div>
                    </div>
                  </v-expand-transition>
                </div>
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
            <span>Add User</span>
          </v-card-title>
          <v-card-text class="pt-2">
            <v-form ref="userForm" v-model="formValid">
              <v-text-field
                v-model="newUser.username"
                label="Username"
                prepend-inner-icon="mdi-account-circle"
                variant="outlined"
                density="comfortable"
                :rules="usernameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.password"
                label="Password"
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
                :rules="[(v) => !!v || 'Config ID must be selected']"
                required
              ></v-select>
              <div class="d-flex justify-end mt-2">
                <v-btn
                  color="blue-grey-lighten-1"
                  variant="elevated"
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
                  Save
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Alerts -->
    <AlertComponent :message="alertMessage" :type="alertType" />
  </v-container>
</template>

<script>
import UserApiService from "../services/userApi.js";
import ConfigApiService from "../services/configApi.js";
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
      // Config details inline display
      expandedRows: [], // Array of expanded user IDs
      configDetailsCache: {}, // Cache for config details
      allConfigs: [], // Store all config data for details lookup
      // Add user form state
      formValid: false,
      saving: false,
      showPassword: false,
      loadingConfigs: false,
      newUser: { username: "", password: "", configId: null },
      configOptions: [],
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => (v && v.length >= 3) || "Username must be at least 3 characters",
        (v) =>
          /^[a-zA-Z0-9_]+$/.test(v) ||
          "Username can only contain letters, numbers, and underscores",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
      headers: [
        { title: "", key: "avatar", sortable: false, width: "60px" },
        { title: "ID", key: "id", sortable: true, width: "80px" },
        { title: "Username", key: "username", sortable: true },
        { title: "Role", key: "roles", sortable: true },
        { title: "Config ID", key: "configId", sortable: false },
        { title: "Created", key: "createdAt", sortable: true },
      ],
    };
  },
  methods: {
    toggleAllConfigDetails() {
      if (
        this.expandedRows.length === this.filteredUsers.length &&
        this.filteredUsers.length > 0
      ) {
        // Collapse all
        this.expandedRows = [];
      } else {
        // Expand all
        this.expandedRows = this.filteredUsers.map((user) => user.id);
        this.filteredUsers.forEach((user) => {
          if (!this.configDetailsCache[user.id]) {
            const foundConfig = this.allConfigs.find(
              (config) => String(config.configId) === String(user.configId)
            );
            if (foundConfig) {
              this.configDetailsCache[user.id] = {
                configId: foundConfig.configId,
                region: foundConfig.region || "N/A",
                code: foundConfig.code || `CFG${user.configId}`,
                description:
                  foundConfig.description ||
                  foundConfig.region ||
                  foundConfig.code ||
                  "No description available",
                status: foundConfig.status || "active",
                createdAt: foundConfig.createdAt,
              };
            }
          }
        });
      }
    },
    async addUser() {
      if (!this.$refs.userForm.validate()) {
        this.showAlert("Please complete all required fields", "error");
        return;
      }
      this.saving = true;
      try {
        const userData = {
          username: this.newUser.username,
          password: this.newUser.password,
          configId: this.newUser.configId,
        };
        await UserApiService.addUser(userData);
        this.showAlert("User successfully registered", "success");
        this.resetForm();
        // Optionally refresh list
        this.refreshUsers();
      } catch (e) {
        this.showAlert("Failed to register user", "error");
      } finally {
        this.saving = false;
      }
    },

    resetForm() {
      this.newUser = { username: "", password: "", configId: null };
      this.formValid = false;
      this.showPassword = false;
      if (this.$refs.userForm) {
        this.$refs.userForm.resetValidation();
        this.$refs.userForm.reset();
      }
    },
    async fetchUsers() {
      this.loadingUsers = true;
      try {
        const response = await UserApiService.getUsers();

        // Handle response berdasarkan struktur API
        this.users = Array.isArray(response) ? response : response.data || [];
        this.filteredUsers = [...this.users];
      } catch (error) {
        this.showAlert("Failed to load user list", "error");
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
        this.showAlert("User list successfully updated", "success");
      } catch (error) {
        this.showAlert("Failed to update user list", "error");
      } finally {
        this.refreshing = false;
      }
    },

    async fetchConfigs() {
      this.loadingConfigs = true;
      try {
        const response = await ConfigApiService.getConfig();

        // Handle array response from API
        const configs = Array.isArray(response)
          ? response
          : response.data || [];

        // Store all configs for details lookup
        this.allConfigs = configs;

        // Transform configs to match v-select format
        this.configOptions = configs.map((config) => ({
          title: `Config ${config.configId} - ${
            config.region || config.code || "No description"
          }`,
          value: config.configId,
          data: config, // Store full config data
        }));

        if (this.configOptions.length === 0) {
          this.showAlert("No configurations available", "warning");
        }
      } catch (error) {
        this.showAlert("Failed to load configuration list", "error");
        this.configOptions = [];
        this.allConfigs = [];
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
        return "Invalid date format";
      }
    },

    formatTime(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
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

    toggleConfigDetails(userId, configId) {
      console.log("Toggling config details for userId:", userId);
      console.log("Config ID:", configId);
      // If already expanded, collapse it
      console.log(this.expandedRows, userId);
      if (this.expandedRows.includes(userId)) {
        this.expandedRows = this.expandedRows.filter((id) => id !== userId);
        return;
      }

      // Add to expanded list
      this.expandedRows.push(userId);

      // If details already cached, don't fetch again
      if (this.configDetailsCache[userId]) {
        return;
      }

      // Debug log untuk pencarian config
      console.log("Toggle config details:", { userId, configId });
      console.log(
        "allConfigs:",
        this.allConfigs.map((c) => ({
          configId: c.configId,
          type: typeof c.configId,
        }))
      );
      console.log("Comparing:", String(configId));

      // Find config dari allConfigs dengan pencocokan string
      const foundConfig = this.allConfigs.find(
        (config) => String(config.configId) === String(configId)
      );
      console.log("Found config:", foundConfig);

      if (foundConfig) {
        // Cache the config details using full config data
        this.configDetailsCache[userId] = {
          configId: foundConfig.configId,
          region: foundConfig.region || "N/A",
          code: foundConfig.code || `CFG${configId}`,
        };
      } else {
        this.showAlert(
          `Config ID ${configId} not found in loaded configurations`,
          "warning"
        );
        // Remove from expanded list if not found
        this.expandedRows = this.expandedRows.filter((id) => id !== userId);
      }
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

.config-view-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.config-view-btn:hover {
  opacity: 1;
}

.config-cell {
  min-width: 200px;
}

.config-details {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 6px;
  padding: 8px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.config-info .text-caption {
  line-height: 1.4;
}
</style>
