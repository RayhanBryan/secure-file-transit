<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-cog</v-icon>
          Lihat Konfigurasi
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Tampilkan konfigurasi sistem saat ini
        </p>
      </v-col>
    </v-row>

    <!-- Main Action Card -->
    <v-row class="justify-center">
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-cog-outline</v-icon>
            Konfigurasi Sistem
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- Load Configuration Button -->
            <div class="text-center mb-6">
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                @click="loadConfig"
                :loading="loading"
                class="px-8"
                rounded="lg"
              >
                <v-icon left>mdi-refresh</v-icon>
                Muat Konfigurasi
              </v-btn>
            </div>

            <!-- Configuration Display -->
            <div v-if="configData">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-h6 bg-grey-lighten-4">
                  <v-icon class="mr-2" color="info">mdi-information</v-icon>
                  Detail Konfigurasi
                </v-card-title>
                <v-card-text class="pa-4">
                  <!-- Search Field -->
                  <div class="mb-4">
                    <v-text-field
                      v-model="searchQuery"
                      prepend-inner-icon="mdi-magnify"
                      label="Cari konfigurasi..."
                      variant="outlined"
                      density="compact"
                      clearable
                      hide-details
                      class="search-field"
                    ></v-text-field>
                  </div>

                  <v-table class="config-table">
                    <thead>
                      <tr class="table-header">
                        <th
                          class="text-left font-weight-bold text-grey-darken-4"
                        >
                          Config ID
                        </th>
                        <th
                          class="text-left font-weight-bold text-grey-darken-4"
                        >
                          Region
                        </th>
                        <th
                          class="text-left font-weight-bold text-grey-darken-4"
                        >
                          Code
                        </th>
                        <th
                          class="text-left font-weight-bold text-grey-darken-4"
                        >
                          Shared Secret
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(config, index) in filteredConfigData"
                        :key="index"
                        class="table-row"
                      >
                        <td
                          class="font-weight-bold text-primary config-id-cell"
                        >
                          {{ config.configId }}
                        </td>
                        <td class="text-grey-darken-4 font-weight-medium">
                          {{ config.region }}
                        </td>
                        <td class="text-grey-darken-4 font-weight-medium">
                          {{ config.code }}
                        </td>
                        <td class="text-grey-darken-4 font-weight-medium">
                          {{ config.sharedSecret }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <!-- No Results Message -->
                  <div
                    v-if="filteredConfigData.length === 0"
                    class="text-center py-8"
                  >
                    <v-icon size="48" color="grey-lighten-2" class="mb-2">
                      mdi-magnify-remove
                    </v-icon>
                    <p class="text-body-2 text-grey-darken-2">
                      Tidak ada konfigurasi yang sesuai dengan pencarian "{{
                        searchQuery
                      }}"
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2" class="mb-4">
                mdi-cog-off
              </v-icon>
              <h3 class="text-h6 text-grey-darken-1 mb-2">
                Belum Ada Konfigurasi
              </h3>
              <p class="text-body-2 text-grey-darken-2">
                Klik tombol "Muat Konfigurasi" untuk mengambil data konfigurasi
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Alerts -->
    <AlertComponent :message="alertMessage" :type="alertType" />
  </v-container>
</template>

<script>
import ApiService from "@/services/api";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "GetConfigComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      loading: false,
      configData: null,
      alertMessage: "",
      alertType: "success",
      apiUrl: `${ApiService.baseURL}/config/get-all`,
      searchQuery: "",
    };
  },
  computed: {
    filteredConfigData() {
      if (!this.configData || !this.searchQuery) {
        return Object.values(this.configData || {});
      }

      const query = this.searchQuery.toLowerCase();
      return Object.values(this.configData).filter((config) => {
        return (
          config.configId?.toString().toLowerCase().includes(query) ||
          config.region?.toLowerCase().includes(query) ||
          config.code?.toLowerCase().includes(query) ||
          config.sharedSecret?.toLowerCase().includes(query)
        );
      });
    },
  },
  mounted() {
    // Auto load configuration on component mount
    this.loadConfig();
  },
  methods: {
    async loadConfig() {
      this.loading = true;
      try {
        const response = await ApiService.getConfig();
        console.log("Config response:", response);

        // Handle array response from API
        if (Array.isArray(response)) {
          // Convert array to object for easier display
          const configObject = {};
          response.forEach((config, index) => {
            configObject[`config_${config.configId || index}`] = config;
          });
          this.configData = configObject;
        } else {
          this.configData = response;
        }

        this.showAlert("Konfigurasi berhasil dimuat", "success");
      } catch (error) {
        console.error("Error loading config:", error);
        this.showAlert("Gagal memuat konfigurasi", "error");
        this.configData = null;
      } finally {
        this.loading = false;
      }
    },

    formatKey(key) {
      // Convert camelCase or snake_case to readable format
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (str) => str.toUpperCase());
    },

    formatValue(value) {
      if (value === null || value === undefined) {
        return "Tidak diatur";
      }
      if (typeof value === "boolean") {
        return value ? "Ya" : "Tidak";
      }
      if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    },

    exportAsJson() {
      if (!this.configData) return;

      const dataStr = JSON.stringify(this.configData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `config_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.showAlert("Konfigurasi berhasil diekspor sebagai JSON", "success");
    },

    async copyToClipboard() {
      if (!this.configData) return;

      try {
        const configText = JSON.stringify(this.configData, null, 2);
        await navigator.clipboard.writeText(configText);
        this.showAlert("Konfigurasi berhasil disalin ke clipboard", "success");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        this.showAlert("Gagal menyalin ke clipboard", "error");
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

.config-key {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1565c0 !important;
}

.config-details {
  color: #1e293b;
}

/* Enhanced button styling */
.enhanced-button {
  font-weight: 600 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
}

.enhanced-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.button-text-enhanced {
  color: white !important;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Success button styling */
.success-button {
  background-color: #4caf50 !important;
}

.success-text-button {
  color: #1b5e20 !important;
  font-weight: 600;
  font-size: 0.95rem;
}

.success-icon {
  color: #2e7d32 !important;
}

/* Info button styling */
.info-button {
  background-color: #2196f3 !important;
}

.info-text-button {
  color: #0d47a1 !important;
  font-weight: 600;
  font-size: 0.95rem;
}

.info-icon {
  color: #1565c0 !important;
}

/* Configuration table styling */
.config-table {
  border-collapse: separate;
  border-spacing: 0;
}

.table-header th {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 16px !important;
  font-size: 0.95rem;
  font-weight: 700 !important;
  color: #424242 !important;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #fafafa !important;
}

.table-row td {
  padding: 16px !important;
  border-bottom: 1px solid #f5f5f5 !important;
  font-size: 0.9rem;
  vertical-align: middle;
}

.config-id-cell {
  font-size: 1rem !important;
  color: #1565c0 !important;
}

/* Search field styling */
.search-field {
  max-width: 400px;
}

.search-field .v-field {
  border-radius: 8px;
}

/* Configuration card styling */
.v-card[variant="tonal"] {
  transition: all 0.3s ease;
}

.v-card[variant="tonal"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Export buttons styling */
.v-btn[variant="outlined"] {
  transition: all 0.3s ease;
}

.v-btn[variant="outlined"]:hover {
  transform: translateY(-1px);
}
</style>
