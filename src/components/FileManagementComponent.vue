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
          <v-card-text class="text-center pa-6">
            <v-icon class="text-primary mb-3" size="48">mdi-cart-plus</v-icon>
            <h3 class="text-h5 font-weight-bold mb-3 text-primary">
              Order New CSV File
            </h3>
            <p class="text-body-1 text-grey-darken-1 mb-4">
              Click the button below to order new CSV files from the system
            </p>

            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              @click="orderCsvFile"
              :loading="ordering"
              class="px-8 py-3"
              rounded="lg"
            >
              <v-icon left size="20">mdi-cart-plus</v-icon>
              Order CSV File
            </v-btn>

            <!-- Order Success Message -->
            <div v-if="orderSuccess" class="mt-4">
              <v-card
                v-if="statusId"
                elevation="1"
                rounded="lg"
                color="success"
                variant="tonal"
                class="mt-4"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="success" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    <span class="text-h6 font-weight-bold">
                      Order Successfully Created
                    </span>
                  </div>

                  <div class="status-id-container">
                    <p class="text-caption text-grey-darken-1 mb-2 text-center">
                      Processing Status ID:
                    </p>
                    <div class="id-display-wrapper">
                      <v-text-field
                        :model-value="statusId"
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
                            @click="copyStatusId"
                            :disabled="!statusId"
                            :title="copied ? 'Copied!' : 'Copy ID'"
                          >
                            <v-icon
                              :color="
                                copied ? 'green-darken-3' : 'blue-darken-2'
                              "
                              size="20"
                            >
                              {{ copied ? "mdi-check" : "mdi-content-copy" }}
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
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="goToGetStatus"
                class="mt-3"
                rounded="lg"
              >
                <v-icon left size="18">mdi-eye</v-icon>
                View Processing Status
              </v-btn>
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
                v-for="(file, index) in files"
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
      <v-col cols="12" md="12">
        <v-card elevation="1" rounded="lg" color="info" variant="tonal">
          <v-card-text class="text-center pa-4">
            <v-icon color="info" class="mb-2" size="32"
              >mdi-file-multiple</v-icon
            >
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
      alertMessage: "",
      alertType: "success",
      // Order file related data
      ordering: false,
      orderSuccess: false,
      statusId: "",
      copied: false,
    };
  },
  computed: {
    // No additional computed properties needed
  },
  mounted() {
    this.loadFiles();
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
        } else {
          // No data from API - show empty state
          this.files = [];
        }

        this.showAlert("Files loaded successfully", "success");
      } catch (error) {
        console.error("Error loading files:", error);
        this.showAlert("Failed to load files", "error");

        // Show empty state on error - no dummy data
        this.files = [];
      } finally {
        this.loading = false;
      }
    },

    async orderCsvFile() {
      this.ordering = true;
      this.orderSuccess = false;
      this.statusId = "";
      this.copied = false;

      try {
        const response = await ApiService.getCsv();

        // Extract status ID from response message
        if (response && response.message) {
          const message = response.message;

          // Extract ID using regex - looking for UUID pattern
          const idMatch = message.match(/id\s+([a-f0-9-]{36})/i);
          if (idMatch && idMatch[1]) {
            this.statusId = idMatch[1];
          }

          // Check if response contains success message
          if (message.includes("Succes Ordering CSV File")) {
            this.orderSuccess = true;
            this.showAlert(
              "CSV order successfully created! File is being processed.",
              "success"
            );
          } else {
            this.showAlert("CSV order successfully created!", "success");
            this.orderSuccess = true;
          }
        } else {
          this.showAlert("CSV order successfully created!", "success");
          this.orderSuccess = true;
        }

        // Refresh file list after ordering
        setTimeout(() => {
          this.loadFiles();
        }, 2000);
      } catch (error) {
        console.error("Error ordering CSV:", error);
        this.showAlert("Failed to create CSV order", "error");
        this.orderSuccess = false;
      } finally {
        this.ordering = false;
      }
    },

    async copyStatusId() {
      if (!this.statusId) return;

      try {
        await navigator.clipboard.writeText(this.statusId);
        this.copied = true;
        this.showAlert("Status ID successfully copied!", "success");

        // Reset copy status after 2 seconds
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
        this.showAlert("Failed to copy status ID", "error");
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
