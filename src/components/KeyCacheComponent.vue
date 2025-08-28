<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-key</v-icon>
          Key Cache Management
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Kelola key cache untuk sistem enkripsi file
        </p>
      </v-col>
    </v-row>

    <!-- Download Button -->
    <v-card class="mb-4" elevation="2" rounded="lg">
      <v-alert type="info" variant="tonal">
        <template v-slot:prepend>
          <v-icon color="blue-darken-2">mdi-information</v-icon>
        </template>
        <div>
          <p class="mb-2 font-weight-medium text-blue-darken-3">
            Tentang Key Cache:
          </p>
          <ul class="ml-4 text-blue-darken-2">
            <li class="mb-1">
              Key cache digunakan untuk enkripsi/dekripsi file secara offline
            </li>
            <li class="mb-1">
              Hanya user dengan key cache yang valid dapat mengakses file
              terenkripsi
            </li>
            <li>Key cache memiliki masa berlaku tertentu</li>
          </ul>
        </div>
      </v-alert>
    </v-card>

    <v-row>
      <v-col cols="12" class="text-center d-flex justify-center">
        <v-btn
          color="blue-darken-2"
          variant="elevated"
          size="x-large"
          @click="downloadKeyCache"
          :loading="downloading"
          class="px-12 py-4 d-flex align-center justify-center"
          style="min-height: 64px"
        >
          <v-icon left size="large">mdi-download</v-icon>
          <span class="ml-2">Download Key Cache</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Success/Error Alerts -->
    <v-alert
      v-if="alertMessage"
      :type="alertType"
      variant="tonal"
      class="mt-4"
      rounded="lg"
      closable
      @click:close="alertMessage = ''"
    >
      {{ alertMessage }}
    </v-alert>
  </v-container>
</template>

<script>
import ApiService from "@/services/api";

export default {
  name: "KeyCacheComponent",
  data() {
    return {
      downloading: false,
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
          let filename = response.filename || "voltage-key-cache.zip";
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

          this.showAlert("File ZIP key cache berhasil didownload", "success");
        } else {
          throw new Error("No file data received from server");
        }
      } catch (error) {
        console.error("Download error:", error);
        this.showAlert(
          "Gagal download key cache: " + (error.message || error),
          "error"
        );
      } finally {
        this.downloading = false;
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
