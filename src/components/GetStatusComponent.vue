<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-chart-line</v-icon>
          Status Dashboard
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Monitor system status and activity in real time
        </p>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row class="mt-4">
      <v-col cols="6">
        <v-btn
          color="blue-darken-2"
          variant="outlined"
          size="large"
          @click="refreshStatus"
          :loading="refreshing"
          width="100%"
        >
          <v-icon left>mdi-refresh</v-icon>
          Refresh Status
        </v-btn>
      </v-col>
    </v-row>
    <!-- Detailed Status -->
    <v-row>
      <!-- File Processing Status -->
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-file-clock</v-icon>
            File Processing Status
          </v-card-title>
          <v-card-text>
            <div v-if="loadingStatuses" class="text-center py-4">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
              <div class="text-caption mt-2">Loading file statuses...</div>
            </div>
            <div v-else-if="fileStatuses.length === 0" class="text-center py-4">
              <v-icon size="48" color="grey-lighten-1"
                >mdi-file-question</v-icon
              >
              <div class="text-subtitle-2 text-grey-darken-1 mt-2">
                No files in process
              </div>
            </div>
            <v-table v-else density="compact">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold text-grey-darken-3">
                    Status
                  </th>
                  <th class="text-left font-weight-bold text-grey-darken-3">
                    Username
                  </th>
                  <th class="text-left font-weight-bold text-grey-darken-3">
                    Queue
                  </th>
                  <th class="text-left font-weight-bold text-grey-darken-3">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="fileStatus in fileStatuses"
                  :key="fileStatus.statusId"
                >
                  <td>
                    <div class="d-flex align-center">
                      <v-icon
                        :color="getFileStatusColor(fileStatus.status)"
                        class="mr-2"
                        size="20"
                      >
                        {{ getFileStatusIcon(fileStatus.status) }}
                      </v-icon>
                      <v-chip
                        :color="getFileStatusColor(fileStatus.status)"
                        size="small"
                        variant="flat"
                        class="text-white"
                      >
                        {{ fileStatus.status }}
                      </v-chip>
                    </div>
                  </td>
                  <td>
                    <div class="font-weight-medium text-grey-darken-3">
                      {{ fileStatus.username }}
                    </div>
                  </td>
                  <td>
                    <div class="text-grey-darken-2">
                      #{{ fileStatus.order }} of {{ fileStatus.totalOrder }}
                    </div>
                    <v-progress-linear
                      :model-value="
                        ((fileStatus.totalOrder - fileStatus.order + 1) /
                          fileStatus.totalOrder) *
                        100
                      "
                      :color="
                        getQueuePositionColor(
                          fileStatus.order,
                          fileStatus.totalOrder
                        )
                      "
                      height="4"
                      class="mt-1"
                      rounded
                    ></v-progress-linear>
                    <div class="text-caption text-grey-darken-1 mt-1">
                      {{
                        getQueueText(fileStatus.order, fileStatus.totalOrder)
                      }}
                    </div>
                  </td>
                  <td>
                    <v-tooltip>
                      <template v-slot:activator="{ props }">
                        <div
                          class="text-caption text-grey-darken-2"
                          v-bind="props"
                          style="
                            cursor: help;
                            text-decoration: underline dotted;
                          "
                        >
                          {{ formatTime(fileStatus.lastUpdated) }}
                        </div>
                      </template>
                      <span>{{ formatExactTime(fileStatus.lastUpdated) }}</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Alerts -->
    <AlertComponent
      v-if="alertMessage"
      :type="alertType"
      :message="alertMessage"
      class="mt-4"
    />
  </v-container>
</template>

<script>
import ApiService from "../services/api.js";
import AlertComponent from "@/components/shared/AlertComponent.vue";

export default {
  name: "GetStatusComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      refreshing: false,
      downloading: false,
      alertMessage: "",
      alertType: "success",
      fileStatuses: [], // Data from API
      loadingStatuses: false,
    };
  },
  methods: {
    async fetchFileStatus() {
      this.loadingStatuses = true;
      try {
        console.log("Fetching file status...");
        const response = await ApiService.getFileStatus(20, 0);
        console.log("File status response:", response);

        // Handle response based on actual API structure
        this.fileStatuses = Array.isArray(response)
          ? response
          : response.data || [];

        // Sort fileStatuses by lastUpdated (newest to oldest)
        this.fileStatuses.sort((a, b) => {
          const dateA = new Date(a.lastUpdated);
          const dateB = new Date(b.lastUpdated);
          return dateB - dateA; // Descending order (newest first)
        });

        console.log(
          "File status loaded successfully:",
          this.fileStatuses.length,
          "items"
        );
      } catch (error) {
        console.error("Error fetching file status:", error);
        this.showAlert("Failed to load file status", "error");
        // Clear data on error
        this.fileStatuses = [];
      } finally {
        this.loadingStatuses = false;
      }
    },

    formatTime(dateString) {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minutes ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
      } catch (error) {
        return "Unknown time";
      }
    },

    formatExactTime(dateString) {
      try {
        const date = new Date(dateString);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        };
        return date.toLocaleString("en-US", options);
      } catch (error) {
        return "Time cannot be formatted";
      }
    },

    async refreshStatus() {
      this.refreshing = true;
      try {
        // Refresh file status data
        await this.fetchFileStatus();

        // Simulate API call to refresh other status
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // this.showAlert("Status berhasil diperbarui", "success");
      } catch (error) {
        this.showAlert("Failed to refresh status", "error");
      } finally {
        this.refreshing = false;
      }
    },

    async downloadReport() {
      this.downloading = true;
      try {
        // Simulate report generation and download
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create download link
        const link = document.createElement("a");
        link.href = "#"; // Replace with actual download URL
        link.download = "status-report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showAlert("Report downloaded successfully", "success");
      } catch (error) {
        this.showAlert("Failed to download report", "error");
      } finally {
        this.downloading = false;
      }
    },

    getFileStatusColor(status) {
      const colors = {
        uploading: "blue-darken-2",
        waiting: "orange-darken-2",
        processing: "blue-darken-2",
        completed: "green-darken-2",
        error: "red-darken-2",
        failed: "red-darken-2",
      };
      return colors[status] || "grey-darken-2";
    },

    getFileStatusIcon(status) {
      const icons = {
        uploading: "mdi-upload",
        waiting: "mdi-clock-outline",
        processing: "mdi-cog",
        completed: "mdi-check-circle",
        error: "mdi-alert-circle",
        failed: "mdi-close-circle",
      };
      return icons[status] || "mdi-help-circle";
    },

    getQueuePositionColor(order, totalOrder) {
      const percentage = (order / totalOrder) * 100;

      if (percentage <= 25) {
        return "green-darken-2"; // Top 25% - high priority
      } else if (percentage <= 50) {
        return "blue-darken-2"; // Top 50% - medium-high priority
      } else if (percentage <= 75) {
        return "orange-darken-2"; // Top 75% - medium priority
      } else {
        return "red-darken-2"; // Bottom 25% - low priority
      }
    },

    getQueueText(order, totalOrder) {
      const itemsAhead = order - 1;
      return `${itemsAhead} items ahead`;
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
    // Fetch initial file status data
    this.fetchFileStatus();

    // Auto refresh status every 30 seconds
    // this.statusInterval = setInterval(() => {
    //   // Auto refresh file status
    //   this.fetchFileStatus();
    //   console.log("Auto refreshing status...");
    // }, 30000);
  },
  beforeUnmount() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
};
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

/* Custom card styling for better contrast */
.success-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-left: 4px solid #2e7d32;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #1565c0;
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
}

.warning-card {
  background: linear-gradient(135deg, #fff3e0 0%, #fef7ff 100%);
  border-left: 4px solid #ef6c00;
  box-shadow: 0 4px 12px rgba(239, 108, 0, 0.15);
}

.secondary-card {
  background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
  border-left: 4px solid #7b1fa2;
  box-shadow: 0 4px 12px rgba(123, 31, 162, 0.15);
}

/* Better text contrast */
.v-card-text p {
  color: #1e293b;
}

.v-card-title {
  color: #1e293b !important;
}

/* Timeline dot styling */
.v-timeline-item .v-timeline-item__dot {
  box-shadow: none !important;
}
</style>
