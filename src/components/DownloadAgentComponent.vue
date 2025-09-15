<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-download</v-icon>
          Download Agent
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Download agent application and key cache for file encryption system
        </p>
      </v-col>
    </v-row>

    <!-- About Section - Split Layout -->
    <v-row class="mb-4">
      <!-- Left About: Installer Agent -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg">
          <v-alert type="info" variant="tonal">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-application-cog</v-icon>
            </template>
            <div>
              <p class="mb-2 font-weight-medium text-primary">
                About Installer Agent:
              </p>
              <ul class="ml-4 text-black">
                <li class="mb-1">
                  Agent application enables file encryption capabilities
                </li>
                <li class="mb-1">Must be installed before using key cache</li>
                <li class="mb-1">
                  Provides secure file processing environment
                </li>
                <li>Required for system integration</li>
              </ul>
            </div>
          </v-alert>
        </v-card>
      </v-col>

      <!-- Right About: Key Cache -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg">
          <v-alert type="info" variant="tonal">
            <template v-slot:prepend>
              <v-icon color="blue-darken-2">mdi-key-chain</v-icon>
            </template>
            <div>
              <p class="mb-2 font-weight-medium text-blue-darken-3">
                About Key Cache:
              </p>
              <ul class="ml-4 text-black">
                <li class="mb-1">
                  Key cache is used for offline file encryption/decryption
                </li>
                <li class="mb-1">
                  Only users with a valid key cache can access encrypted files
                </li>
                <li class="mb-1">Key cache has a limited validity period</li>
                <li>Download after installing the agent</li>
              </ul>
            </div>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Split Layout: Left and Right Sections -->
    <v-row>
      <!-- Left Section: Installer Agent Download -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="h-100">
          <v-card-title class="pb-2 d-flex align-center">
            <v-icon class="text-primary mr-2">mdi-download-box</v-icon>
            <span>Installer Agent</span>
          </v-card-title>
          <v-card-text
            class="d-flex flex-column justify-center align-center pa-6"
          >
            <v-icon size="80" color="primary" class="mb-4"
              >mdi-application-cog</v-icon
            >
            <h3 class="text-h6 mb-3 text-center">Download Installer Agent</h3>
            <p class="text-body-2 text-grey-darken-1 mb-4 text-center">
              Download and install the agent application to enable file
              encryption capabilities on your system.
            </p>
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              @click="downloadInstaller"
              :loading="downloadingInstaller"
              class="px-8"
            >
              <v-icon left>mdi-download</v-icon>
              Download Installer
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Section: Key Cache Download -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="h-100">
          <v-card-title class="pb-2 d-flex align-center">
            <v-icon class="mr-2" color="blue-darken-2">mdi-key</v-icon>
            <span>Key Cache</span>
          </v-card-title>
          <v-card-text
            class="d-flex flex-column justify-center align-center pa-6"
          >
            <v-icon size="80" color="blue-darken-2" class="mb-4"
              >mdi-key-chain</v-icon
            >
            <h3 class="text-h6 mb-3 text-center">Download Key Cache</h3>
            <p class="text-body-2 text-grey-darken-1 mb-4 text-center">
              Download the key cache ZIP file containing encryption keys
              required for secure file operations.
            </p>
            <v-btn
              color="blue-darken-2"
              variant="elevated"
              size="large"
              @click="downloadKeyCache"
              :loading="downloading"
              class="px-8"
            >
              <v-icon left>mdi-download</v-icon>
              Download Key Cache
            </v-btn>
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
import ApiService from "@/services/api";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "DownloadAgentComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      downloading: false,
      downloadingInstaller: false,
      alertMessage: "",
      alertType: "success",
    };
  },
  methods: {
    async downloadKeyCache() {
      this.downloading = true;
      try {
        // Call actual API endpoint
        const response = await ApiService.downloadVoltageKeyCache();

        if (response.success && response.data) {
          // Create download link for ZIP file
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;

          // Ensure filename has .zip extension
          let filename = "secure-key-" + this.getFormattedTimestamp() + ".zip";
          if (!filename.endsWith(".zip")) {
            filename = filename.replace(/\.[^/.]+$/, "") + ".zip";
          }
          link.download = filename;

          // Force download by adding download attribute
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the URL object
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);

          this.showAlert(
            "Key cache ZIP file downloaded successfully",
            "success"
          );
        } else {
          throw new Error("No file data received from server");
        }
      } catch (error) {

        this.showAlert(
          "Failed to download key cache: " + (error.message || error),
          "error"
        );
      } finally {
        this.downloading = false;
      }
    },

    async downloadInstaller() {
      this.downloadingInstaller = true;
      try {
        // Call API endpoint for installer download
        const response = await ApiService.downloadInstallerAgent();

        if (response.success && response.data) {
          // Create download link for installer file
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;

          // Set filename
          let filename = "secure-file-agent-v1.0.0.exe";
          link.download = filename;

          // Force download
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the URL object
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);

          this.showAlert("Installer agent downloaded successfully", "success");
        } else {
          throw new Error("No installer data received from server");
        }
      } catch (error) {

        this.showAlert(
          "Failed to download installer: " + (error.message || error),
          "error"
        );
      } finally {
        this.downloadingInstaller = false;
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

    getFormattedTimestamp() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      return `${year}${month}${day}_${hours}${minutes}${seconds}`;
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

/* Button alignment fix */
.v-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.v-btn .v-icon {
  margin-right: 8px !important;
  margin-left: 0 !important;
}
</style>
