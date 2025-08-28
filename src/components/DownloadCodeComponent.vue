<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-download</v-icon>
          Secure File Transit - Download Center
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Download installer dan file konfigurasi untuk sistem Secure File
          Transit
        </p>
      </v-col>
    </v-row>

    <!-- Code Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-code-tags</v-icon>
            Code
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="displayCode"
                  readonly
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="XXXXXXXXXXX"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2">
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="toggleShowCode"
                  block
                  class="d-flex align-center"
                >
                  <v-icon left size="16">{{
                    showCode ? "mdi-eye-off" : "mdi-eye"
                  }}</v-icon>
                  {{ showCode ? "Hide" : "Show" }}
                </v-btn>
              </v-col>
              <v-col cols="6" md="2">
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="copyCode"
                  block
                  class="d-flex align-center"
                >
                  <v-icon left size="16">mdi-content-copy</v-icon>
                  Copy
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Download File Code Button -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          size="large"
          block
          @click="downloadFileCode"
          class="download-btn"
        >
          <v-icon left>mdi-download</v-icon>
          Download File Code
        </v-btn>
      </v-col>
    </v-row>

    <!-- Download Cards -->
    <v-row>
      <!-- Installer Agent Windows -->
      <v-col cols="12" md="6" lg="4">
        <v-card
          elevation="3"
          hover
          class="download-card h-100 d-flex flex-column"
        >
          <v-card-text class="text-center pa-6 flex-grow-1 d-flex flex-column">
            <div class="mb-4">
              <h3 class="text-h6 font-weight-bold mb-2">Installer Agent</h3>
              <p class="text-subtitle-2 text-grey-darken-1">Windows</p>
            </div>

            <!-- Windows Icon -->
            <div
              class="icon-container mb-4 flex-grow-1 d-flex align-center justify-center"
            >
              <v-avatar size="80" color="primary" class="mb-2">
                <v-icon size="50" color="on-primary"
                  >mdi-microsoft-windows</v-icon
                >
              </v-avatar>
            </div>

            <!-- Download Button -->
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              @click="downloadInstaller"
              block
              class="download-btn mt-auto"
            >
              <v-icon left>mdi-download</v-icon>
              Download (122 MB)
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Key-Cache -->
      <v-col cols="12" md="6" lg="4">
        <v-card
          elevation="3"
          hover
          class="download-card h-100 d-flex flex-column"
        >
          <v-card-text class="text-center pa-6 flex-grow-1 d-flex flex-column">
            <div class="mb-4">
              <h3 class="text-h6 font-weight-bold mb-2">Key-Cache</h3>
            </div>

            <!-- Key-Cache Icon -->
            <div
              class="icon-container mb-4 flex-grow-1 d-flex align-center justify-center"
            >
              <v-avatar size="80" color="warning" class="mb-2">
                <v-icon size="40" color="on-surface">mdi-key</v-icon>
                <v-icon size="30" color="grey-darken-1" class="ml-1"
                  >mdi-cog</v-icon
                >
                >
              </v-avatar>
            </div>

            <!-- Download Button -->
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              @click="downloadKeyCache"
              block
              class="download-btn mt-auto"
            >
              <v-icon left>mdi-download</v-icon>
              Download (2 MB)
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DownloadCodeComponent",
  data() {
    return {
      accessCode: "BRI2024-PEJATEN-ABC123",
      showCode: false,
    };
  },
  computed: {
    displayCode() {
      return this.showCode ? this.accessCode : "XXXXXXXXXXX";
    },
  },
  methods: {
    toggleShowCode() {
      this.showCode = !this.showCode;
      this.$emit(
        "show-notification",
        this.showCode ? "Code ditampilkan" : "Code disembunyikan",
        "info"
      );
    },
    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.accessCode);
        this.$emit("show-notification", "Code berhasil disalin!", "success");
        console.log("Code copied to clipboard");
      } catch (err) {
        console.error("Failed to copy: ", err);
        this.$emit("show-notification", "Gagal menyalin code", "error");
      }
    },
    downloadFileCode() {
      // Simulate file download
      console.log("Downloading file code...");
      this.$emit("show-notification", "Download File Code dimulai", "info");
      // You can implement actual download logic here
    },
    downloadInstaller() {
      // Simulate installer download
      console.log("Downloading installer (122 MB)...");
      this.$emit(
        "show-notification",
        "Download Installer Agent Windows dimulai (122 MB)",
        "info"
      );
      // You can implement actual download logic here
    },
    downloadKeyCache() {
      // Simulate key-cache download
      console.log("Downloading key-cache (2 MB)...");
      this.$emit(
        "show-notification",
        "Download Key-Cache dimulai (2 MB)",
        "info"
      );
      // You can implement actual download logic here
    },
  },
};
</script>

<style scoped>
.download-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.download-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.download-btn {
  font-weight: 600;
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  font-size: 0.875rem !important;
}

/* Ensure button content height */
.download-btn .v-btn__content {
  height: 48px !important;
  line-height: 48px !important;
}

.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Custom styling for code input */
.v-text-field {
  font-family: "Courier New", monospace;
  letter-spacing: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .download-card {
    margin-bottom: 16px;
  }
}
</style>
