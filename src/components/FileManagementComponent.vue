<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-file-multiple</v-icon>
          File Management
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          View and manage available files in the system
        </p>
      </v-col>
    </v-row>

    <!-- Order File Action Card -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg" color="primary" variant="tonal">
          <v-card-text class="pa-6">
            <div class="text-center mb-4">
              <v-icon class="text-primary mb-3" size="48">mdi-cart-plus</v-icon>
              <h3 class="text-h5 font-weight-bold mb-3 text-primary">
                Order CSV File
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-4">
                Choose how you want to order CSV files from the system
              </p>
            </div>

            <!-- Order Options -->
            <v-row class="mb-4">
              <!-- All Usernames Order -->
              <v-col cols="12" md="6">
                <v-card elevation="1" rounded="lg" class="pa-4 h-100">
                  <v-card-text class="text-center">
                    <v-icon color="success" size="32" class="mb-2"
                      >mdi-account-multiple</v-icon
                    >
                    <h4 class="text-h6 font-weight-bold mb-2">
                      All Usernames Order
                    </h4>
                    <p class="text-body-2 text-grey-darken-1 mb-3">
                      Order CSV files for all system usernames
                    </p>
                    <v-btn
                      color="success"
                      variant="elevated"
                      @click="orderCsvAllUsernames"
                      :loading="orderingAllUsernames"
                      block
                      rounded="lg"
                    >
                      <v-icon left size="18">mdi-account-group</v-icon>
                      Order All Usernames
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Specific Usernames Order -->
              <v-col cols="12" md="6">
                <v-card elevation="1" rounded="lg" class="pa-4 h-100">
                  <v-card-text>
                    <div class="text-center mb-3">
                      <v-icon color="secondary" size="32" class="mb-2"
                        >mdi-account-filter</v-icon
                      >
                      <h4 class="text-h6 font-weight-bold mb-2">
                        Specific Usernames
                      </h4>
                      <p class="text-body-2 text-grey-darken-1 mb-3">
                        Order CSV files for specific usernames
                      </p>
                    </div>

                    <!-- Username Dropdown -->
                    <v-autocomplete
                      ref="userAutocomplete"
                      v-model="selectedUser"
                      :items="filteredAvailableUsers"
                      item-title="username"
                      item-value="username"
                      label="Select username"
                      placeholder="Choose a username"
                      variant="outlined"
                      density="compact"
                      hide-details="auto"
                      class="mb-2"
                      clearable
                      :loading="loadingUsers"
                      @update:modelValue="addSelectedUser"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click="loadUsers"
                          :loading="loadingUsers"
                          title="Refresh users"
                        >
                          <v-icon color="primary">mdi-refresh</v-icon>
                        </v-btn>
                      </template>
                    </v-autocomplete>

                    <!-- Username Chips -->
                    <div class="mb-3" v-if="selectedUsernames.length > 0">
                      <v-chip
                        v-for="(username, index) in selectedUsernames"
                        :key="index"
                        closable
                        @click:close="removeUsername(index)"
                        color="primary"
                        variant="tonal"
                        size="small"
                        class="ma-1"
                      >
                        {{ username }}
                      </v-chip>
                    </div>

                    <v-btn
                      color="secondary"
                      variant="elevated"
                      @click="orderCsvFileByUsernames"
                      :loading="orderingUsernames"
                      :disabled="selectedUsernames.length === 0"
                      block
                      rounded="lg"
                    >
                      <v-icon left size="18">mdi-account-multiple</v-icon>
                      Order Selected ({{ selectedUsernames.length }})
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Order Success Messages -->
            <div
              v-if="orderUsernamesSuccess || orderAllUsernamesSuccess"
              class="mt-4"
            >
              <v-card
                v-if="usernameStatusId && orderUsernamesSuccess"
                elevation="1"
                rounded="lg"
                color="success"
                variant="tonal"
                class="mb-3"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="success" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    <span class="text-h6 font-weight-bold">
                      Username-based Order Successfully Created
                    </span>
                  </div>
                  <div class="status-id-container">
                    <p class="text-caption text-grey-darken-1 mb-2 text-center">
                      Processing Status ID:
                    </p>
                    <div class="id-display-wrapper">
                      <v-text-field
                        :model-value="usernameStatusId"
                        readonly
                        variant="outlined"
                        density="compact"
                        class="status-id-field"
                        hide-details
                        bg-color="white"
                      >
                        <template #append-inner>
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            @click="copyUsernameStatusId"
                            :disabled="!usernameStatusId"
                            :title="usernameCopied ? 'Copied!' : 'Copy ID'"
                          >
                            <v-icon
                              :color="
                                usernameCopied
                                  ? 'green-darken-3'
                                  : 'blue-darken-2'
                              "
                              size="20"
                            >
                              {{
                                usernameCopied
                                  ? "mdi-check"
                                  : "mdi-content-copy"
                              }}
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                    <p class="text-caption text-grey-darken-1 mt-2 text-center">
                      Copy this ID to track file processing status
                    </p>
                  </div>
                </v-card-text>
              </v-card>

              <v-card
                v-if="allUsernamesStatusId && orderAllUsernamesSuccess"
                elevation="1"
                rounded="lg"
                color="success"
                variant="tonal"
                class="mb-3"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="success" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    <span class="text-h6 font-weight-bold">
                      All Usernames Order Successfully Created
                    </span>
                  </div>
                  <div class="status-id-container">
                    <p class="text-caption text-grey-darken-1 mb-2 text-center">
                      Processing Status ID:
                    </p>
                    <div class="id-display-wrapper">
                      <v-text-field
                        :model-value="allUsernamesStatusId"
                        readonly
                        variant="outlined"
                        density="compact"
                        class="status-id-field"
                        hide-details
                        bg-color="white"
                      >
                        <template #append-inner>
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            @click="copyAllUsernamesStatusId"
                            :disabled="!allUsernamesStatusId"
                            :title="allUsernamesCopied ? 'Copied!' : 'Copy ID'"
                          >
                            <v-icon
                              :color="
                                allUsernamesCopied
                                  ? 'green-darken-3'
                                  : 'blue-darken-2'
                              "
                              size="20"
                            >
                              {{
                                allUsernamesCopied
                                  ? "mdi-check"
                                  : "mdi-content-copy"
                              }}
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                    <p class="text-caption text-grey-darken-1 mt-2 text-center">
                      Copy this ID to track file processing status
                    </p>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Navigate to status button -->
              <div class="text-center">
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="goToGetStatus"
                  class="mt-2"
                  rounded="lg"
                >
                  <v-icon left size="18">mdi-eye</v-icon>
                  View Processing Status
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- File List Section -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <div>
              <v-icon class="text-primary mr-2" size="24"
                >mdi-folder-open</v-icon
              >
              Available Files
            </div>
            <v-btn
              color="primary"
              variant="elevated"
              @click="loadFiles"
              :loading="loading"
              size="small"
            >
              <v-icon left size="18">mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-card-title>

          <!-- Search Bar -->
          <v-card-text class="pb-0">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search files..."
              variant="outlined"
              hide-details
              clearable
              density="compact"
              class="mb-4"
              @input="filterFiles"
              @update:modelValue="filterFiles"
            ></v-text-field>
          </v-card-text>

          <v-card-text class="pa-0">
            <!-- Loading State -->
            <div v-if="loading && files.length === 0" class="text-center pa-8">
              <v-progress-circular
                indeterminate
                color="primary"
                size="40"
              ></v-progress-circular>
              <p class="text-body-2 mt-4 text-grey-darken-1">
                Loading files...
              </p>
            </div>

            <!-- No Files State -->
            <div
              v-else-if="!loading && filteredFiles.length === 0 && searchQuery"
              class="text-center pa-8"
            >
              <v-icon size="64" color="grey-lighten-1"
                >mdi-file-search-outline</v-icon
              >
              <p class="text-h6 mt-4 text-grey-darken-1">No files found</p>
              <p class="text-body-2 text-grey-darken-1">
                Try adjusting your search terms
              </p>
            </div>

            <!-- No Files Available State -->
            <div
              v-else-if="!loading && files.length === 0"
              class="text-center pa-8"
            >
              <v-icon size="64" color="grey-lighten-1">mdi-file-outline</v-icon>
              <p class="text-h6 mt-4 text-grey-darken-1">No files available</p>
              <p class="text-body-2 text-grey-darken-1">
                Files will appear here when available
              </p>
            </div>

            <!-- Files List -->
            <v-list v-else>
              <v-list-item
                v-for="(file, index) in filteredFiles"
                :key="index"
                class="border-b"
              >
                <template #prepend>
                  <v-icon color="primary">{{ getFileIcon(file.name) }}</v-icon>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ file.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- File Statistics -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="1" rounded="lg" color="info" variant="tonal">
          <v-card-text class="text-center pa-4">
            <v-icon color="info" class="mb-2" size="32"
              >mdi-file-multiple</v-icon
            >
            <p class="text-h6 font-weight-bold mb-1">
              {{ filteredFiles.length }}
            </p>
            <p class="text-body-2 mb-0">
              {{ searchQuery ? "Filtered Files" : "Total Files" }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-if="searchQuery">
        <v-card elevation="1" rounded="lg" color="primary" variant="tonal">
          <v-card-text class="text-center pa-4">
            <v-icon color="primary" class="mb-2" size="32">mdi-database</v-icon>
            <p class="text-h6 font-weight-bold mb-1">{{ files.length }}</p>
            <p class="text-body-2 mb-0">Total Files</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AlertComponent
      v-if="alertMessage"
      :type="alertType"
      :message="alertMessage"
      class="mt-4"
    />
  </v-container>
</template>

<script>
import ApiService from "@/services/api";
import AlertComponent from "@/components/shared/AlertComponent.vue";

export default {
  name: "FileManagementComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      loading: false,
      files: [],
      filteredFiles: [],
      searchQuery: "",
      alertMessage: "",
      alertType: "success",
      // Username-based order data
      orderingUsernames: false,
      orderUsernamesSuccess: false,
      usernameStatusId: "",
      usernameCopied: false,
      selectedUsernames: [],
      // User dropdown data
      availableUsers: [],
      selectedUser: null,
      loadingUsers: false,
      // All usernames order data
      orderingAllUsernames: false,
      orderAllUsernamesSuccess: false,
      allUsernamesStatusId: "",
      allUsernamesCopied: false,
    };
  },
  computed: {
    filteredAvailableUsers() {
      // Filter out users that have already been selected
      return this.availableUsers.filter(
        (user) => !this.selectedUsernames.includes(user.username)
      );
    },
  },
  watch: {
    searchQuery: {
      handler(newValue) {
        this.filterFiles();
      },
      immediate: false,
    },
  },
  mounted() {
    this.loadFiles();
    this.loadUsers();
  },
  methods: {
    async loadFiles() {
      this.loading = true;
      try {
        // Call the new API endpoint to get all file report names
        const response = await ApiService.getAllFileReportNames();

        if (response && response.data && Array.isArray(response.data)) {
          // Transform the file names from the API response into file objects
          this.files = response.data.map((fileName, index) => ({
            id: index + 1,
            name: fileName,
          }));
          // Initialize filtered files
          this.filteredFiles = [...this.files];
        } else {
          // No data from API - show empty state
          this.files = [];
          this.filteredFiles = [];
        }

        this.showAlert("Files loaded successfully", "success");
      } catch (error) {
        console.error("Error loading files:", error);
        this.showAlert("Failed to load files", "error");

        // Show empty state on error - no dummy data
        this.files = [];
        this.filteredFiles = [];
      } finally {
        this.loading = false;
      }
    },

    filterFiles() {
      console.log("filterFiles called with searchQuery:", this.searchQuery);
      console.log("Total files:", this.files.length);

      if (!this.searchQuery || this.searchQuery.trim() === "") {
        // If no search query, show all files
        this.filteredFiles = [...this.files];
        console.log(
          "No search query, showing all files:",
          this.filteredFiles.length
        );
      } else {
        // Filter files based on search query (case insensitive)
        const query = this.searchQuery.toLowerCase().trim();
        this.filteredFiles = this.files.filter((file) =>
          file.name.toLowerCase().includes(query)
        );
        console.log(
          `Filtered with query "${query}":`,
          this.filteredFiles.length,
          "results"
        );
      }
    },

    // User management methods
    async loadUsers() {
      this.loadingUsers = true;
      try {
        const response = await ApiService.getUsers();

        console.log("Full API response:", response);
        console.log("Response data:", response?.data);
        console.log("Response type:", typeof response);

        // Handle different possible response structures
        let userData = null;

        if (response && Array.isArray(response)) {
          // If response is directly an array
          userData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // If response has data property with array
          userData = response.data;
        } else if (
          response &&
          response.users &&
          Array.isArray(response.users)
        ) {
          // If response has users property with array
          userData = response.users;
        } else if (response && Array.isArray(response.result)) {
          // If response has result property with array
          userData = response.result;
        }

        console.log("Processed userData:", userData);

        if (userData && Array.isArray(userData) && userData.length > 0) {
          // Transform users data to have consistent structure
          this.availableUsers = userData.map((user, index) => {
            console.log(`User ${index}:`, user);
            return {
              username:
                user.username ||
                user.name ||
                user.email ||
                user.user_name ||
                `User${index + 1}`,
              id: user.id || index,
              ...user,
            };
          });
          console.log("Final availableUsers:", this.availableUsers);
          this.showAlert(
            `Loaded ${this.availableUsers.length} users successfully`,
            "success"
          );
        } else {
          this.availableUsers = [];
          console.log("No users found or invalid response format");
          console.log("Response structure does not contain user array");
          this.showAlert("No users found in the system", "warning");
        }
      } catch (error) {
        console.error("Error loading users:", error);
        this.showAlert(
          "Failed to load users: " + (error.message || "Unknown error"),
          "error"
        );
        this.availableUsers = [];
      } finally {
        this.loadingUsers = false;
      }
    },

    addSelectedUser() {
      if (
        this.selectedUser &&
        !this.selectedUsernames.includes(this.selectedUser)
      ) {
        this.selectedUsernames.push(this.selectedUser);
        // Clear the selection immediately
        this.selectedUser = "";

        // Force clear the autocomplete component
        this.$nextTick(() => {
          if (this.$refs.userAutocomplete) {
            this.$refs.userAutocomplete.reset();
          }
        });
      }
    },

    removeUsername(index) {
      this.selectedUsernames.splice(index, 1);
    },

    async orderCsvFileByUsernames() {
      if (this.selectedUsernames.length === 0) {
        this.showAlert("Please add at least one username", "error");
        return;
      }

      this.orderingUsernames = true;
      this.orderUsernamesSuccess = false;
      this.usernameStatusId = "";
      this.usernameCopied = false;

      try {
        const response = await ApiService.getCsvWithUsernames(
          this.selectedUsernames
        );

        // Extract status ID from response message
        if (response && response.message) {
          const message = response.message;

          // Extract ID using regex - looking for UUID pattern
          const idMatch = message.match(/id\s+([a-f0-9-]{36})/i);
          if (idMatch && idMatch[1]) {
            this.usernameStatusId = idMatch[1];
          }

          // Check if response contains success message
          if (message.includes("Succes Ordering CSV File")) {
            this.orderUsernamesSuccess = true;
            this.showAlert(
              `CSV order successfully created for ${this.selectedUsernames.length} usernames! File is being processed.`,
              "success"
            );
          } else {
            this.showAlert(
              `CSV order successfully created for usernames: ${this.selectedUsernames.join(
                ", "
              )}!`,
              "success"
            );
            this.orderUsernamesSuccess = true;
          }
        } else {
          this.showAlert(
            `CSV order successfully created for usernames: ${this.selectedUsernames.join(
              ", "
            )}!`,
            "success"
          );
          this.orderUsernamesSuccess = true;
        }

        // Refresh file list after ordering
        setTimeout(() => {
          this.loadFiles();
        }, 2000);
      } catch (error) {
        console.error("Error ordering CSV with usernames:", error);
        this.showAlert("Failed to create username-based CSV order", "error");
        this.orderUsernamesSuccess = false;
      } finally {
        this.orderingUsernames = false;
      }
    },

    async orderCsvAllUsernames() {
      this.orderingAllUsernames = true;
      this.orderAllUsernamesSuccess = false;
      this.allUsernamesStatusId = "";
      this.allUsernamesCopied = false;

      try {
        const response = await ApiService.getCsvAllUsernames();

        // Extract status ID from response message
        if (response && response.message) {
          const message = response.message;

          // Extract ID using regex - looking for UUID pattern
          const idMatch = message.match(/id\s+([a-f0-9-]{36})/i);
          if (idMatch && idMatch[1]) {
            this.allUsernamesStatusId = idMatch[1];
          }

          // Check if response contains success message
          if (
            message.includes("Succes Ordering CSV File For All Username") ||
            message.includes("Success Ordering CSV File For All Username")
          ) {
            this.orderAllUsernamesSuccess = true;
            this.showAlert(
              "CSV order successfully created for all usernames! File is being processed.",
              "success"
            );
          } else {
            this.showAlert(
              "CSV order successfully created for all usernames!",
              "success"
            );
            this.orderAllUsernamesSuccess = true;
          }
        } else {
          this.showAlert(
            "CSV order successfully created for all usernames!",
            "success"
          );
          this.orderAllUsernamesSuccess = true;
        }

        // Refresh file list after ordering
        setTimeout(() => {
          this.loadFiles();
        }, 2000);
      } catch (error) {
        console.error("Error ordering CSV for all usernames:", error);
        this.showAlert("Failed to create all usernames CSV order", "error");
        this.orderAllUsernamesSuccess = false;
      } finally {
        this.orderingAllUsernames = false;
      }
    },

    async copyAllUsernamesStatusId() {
      if (!this.allUsernamesStatusId) return;

      try {
        await navigator.clipboard.writeText(this.allUsernamesStatusId);
        this.allUsernamesCopied = true;
        this.showAlert(
          "All usernames order status ID successfully copied!",
          "success"
        );

        // Reset copy status after 2 seconds
        setTimeout(() => {
          this.allUsernamesCopied = false;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy all usernames status ID:", error);
        this.showAlert("Failed to copy all usernames status ID", "error");
      }
    },

    async copyUsernameStatusId() {
      if (!this.usernameStatusId) return;

      try {
        await navigator.clipboard.writeText(this.usernameStatusId);
        this.usernameCopied = true;
        this.showAlert(
          "Username order status ID successfully copied!",
          "success"
        );

        // Reset copy status after 2 seconds
        setTimeout(() => {
          this.usernameCopied = false;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy username status ID:", error);
        this.showAlert("Failed to copy username status ID", "error");
      }
    },

    goToGetStatus() {
      // Navigate to get-status page
      this.$router.push("/get-status");
    },

    getFileIcon(fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      switch (extension) {
        case "csv":
          return "mdi-file-delimited";
        case "xlsx":
        case "xls":
          return "mdi-file-excel";
        case "pdf":
          return "mdi-file-pdf-box";
        case "txt":
          return "mdi-file-document";
        default:
          return "mdi-file-outline";
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
};
</script>

<style scoped>
/* Order success styling */
.status-id-container {
  max-width: 100%;
}

.status-id-field {
  font-family: "Courier New", monospace;
  font-size: 0.875rem;
}

.status-id-field .v-field__input {
  text-align: center;
  font-weight: 500;
  color: #1e293b !important;
}

.id-display-wrapper {
  position: relative;
}

/* Copy button styling */
.id-display-wrapper .v-btn {
  border-radius: 8px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.id-display-wrapper .v-btn:hover {
  background-color: rgba(25, 118, 210, 0.15) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.id-display-wrapper .v-btn .v-icon {
  transition: all 0.3s ease;
}

.id-display-wrapper .v-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Custom styling for file list */
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

/* Custom styling for better readability */
.v-card-text p {
  color: #1e293b;
}

.v-card-title {
  color: #1e293b !important;
}

/* File action buttons */
.v-list-item .v-btn {
  transition: all 0.3s ease;
}

.v-list-item .v-btn:hover {
  transform: scale(1.1);
}

/* Statistics cards */
.v-card[variant="tonal"] .v-icon {
  opacity: 0.8;
}

/* Loading and empty states */
.v-progress-circular {
  margin: 0 auto;
}

/* File icon styling */
.v-list-item-prepend .v-icon {
  margin-right: 16px !important;
}
</style>
