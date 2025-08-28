<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-plus-circle</v-icon>
          Tambah Konfigurasi
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Tambahkan konfigurasi baru untuk sistem SDA
        </p>
      </v-col>
    </v-row>

    <!-- Configuration Form -->
    <v-row>
      <v-col cols="12" sm="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-plus-box</v-icon>
            Form Tambah Konfigurasi
          </v-card-title>
          <v-card-text class="pa-4 pa-md-6">
            <v-form @submit.prevent="handleAddConfig" ref="configForm">
              <!-- Basic Configuration -->
              <div class="mb-6">
                <h3 class="text-h6 font-weight-bold mb-4 text-primary">
                  � Informasi Dasar
                </h3>

                <v-text-field
                  v-model="config.configId"
                  label="Config ID"
                  prepend-inner-icon="mdi-identifier"
                  variant="outlined"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                  rounded="lg"
                  hint="Contoh: 0, 1, 2 (ID unik untuk konfigurasi)"
                  placeholder="0"
                ></v-text-field>

                <v-text-field
                  v-model="config.region"
                  label="Region"
                  prepend-inner-icon="mdi-map-marker"
                  variant="outlined"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                  rounded="lg"
                  hint="Contoh: jakarta, bandung, surabaya"
                  placeholder="jakarta"
                ></v-text-field>

                <v-text-field
                  v-model="config.code"
                  label="Code"
                  prepend-inner-icon="mdi-code-tags"
                  variant="outlined"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                  rounded="lg"
                  hint="Contoh: 1312, 1313, 1314"
                  placeholder="1312"
                ></v-text-field>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Security Configuration -->
              <div class="mb-6">
                <h3 class="text-h6 font-weight-bold mb-4 text-primary">
                  � Konfigurasi Keamanan
                </h3>

                <v-text-field
                  v-model="config.sharedSecret"
                  label="Shared Secret"
                  prepend-inner-icon="mdi-key"
                  variant="outlined"
                  :type="showSharedSecret ? 'text' : 'password'"
                  :append-inner-icon="
                    showSharedSecret ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="showSharedSecret = !showSharedSecret"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                  rounded="lg"
                  hint="Contoh: asdasd, secret123"
                  placeholder="asdasd"
                ></v-text-field>
              </div>

              <!-- Action Buttons -->
              <v-row class="mt-6">
                <v-col cols="12" sm="4">
                  <v-btn
                    variant="elevated"
                    size="large"
                    @click="fillSampleData"
                    :disabled="loading"
                    color="orange"
                    class="sample-btn"
                    block
                  >
                    <v-icon left>mdi-auto-fix</v-icon>
                    <span class="d-none d-lg-inline">Isi Contoh Data</span>
                    <span class="d-lg-none">Contoh</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn
                    variant="outlined"
                    size="large"
                    @click="resetForm"
                    :disabled="loading"
                    block
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    <span class="d-none d-lg-inline">Reset Form</span>
                    <span class="d-lg-none">Reset</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn
                    type="submit"
                    :color="submitSuccess ? 'success' : 'primary'"
                    variant="elevated"
                    size="large"
                    :loading="loading"
                    block
                  >
                    <v-icon left>
                      {{ submitSuccess ? "mdi-check" : "mdi-plus" }}
                    </v-icon>
                    <span class="d-none d-lg-inline">
                      {{
                        submitSuccess
                          ? "Berhasil Ditambahkan!"
                          : "Tambah Konfigurasi"
                      }}
                    </span>
                    <span class="d-lg-none">
                      {{ submitSuccess ? "Sukses!" : "Tambah" }}
                    </span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Form Status -->
      <v-col cols="12" sm="4">
        <v-card elevation="2" rounded="lg" color="success" variant="tonal">
          <v-card-title class="pb-2">
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            Form Validation
          </v-card-title>
          <v-card-text>
            <div
              class="mb-3"
              :class="config.configId ? 'validation-item-success' : ''"
            >
              <div class="d-flex align-center">
                <v-icon
                  :color="config.configId ? 'success' : 'grey'"
                  class="mr-2"
                >
                  {{
                    config.configId ? "mdi-check-circle" : "mdi-minus-circle"
                  }}
                </v-icon>
                <span class="font-weight-medium">Config ID</span>
              </div>
            </div>

            <div
              class="mb-3"
              :class="config.region ? 'validation-item-success' : ''"
            >
              <div class="d-flex align-center">
                <v-icon
                  :color="config.region ? 'success' : 'grey'"
                  class="mr-2"
                >
                  {{ config.region ? "mdi-check-circle" : "mdi-minus-circle" }}
                </v-icon>
                <span class="font-weight-medium">Region</span>
              </div>
            </div>

            <div
              class="mb-3"
              :class="config.code ? 'validation-item-success' : ''"
            >
              <div class="d-flex align-center">
                <v-icon :color="config.code ? 'success' : 'grey'" class="mr-2">
                  {{ config.code ? "mdi-check-circle" : "mdi-minus-circle" }}
                </v-icon>
                <span class="font-weight-medium">Code</span>
              </div>
            </div>

            <div
              class="mb-4"
              :class="config.sharedSecret ? 'validation-item-success' : ''"
            >
              <div class="d-flex align-center">
                <v-icon
                  :color="config.sharedSecret ? 'success' : 'grey'"
                  class="mr-2"
                >
                  {{
                    config.sharedSecret
                      ? "mdi-check-circle"
                      : "mdi-minus-circle"
                  }}
                </v-icon>
                <span class="font-weight-medium">Shared Secret</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Form Help -->
        <v-card elevation="2" rounded="lg" class="mt-4">
          <v-card-title class="pb-2">
            <v-icon class="mr-2">mdi-help-circle</v-icon>
            Bantuan
          </v-card-title>
          <v-card-text>
            <div class="text-caption mb-2" style="color: #475569">
              <strong>Config ID:</strong> Identifier unik untuk konfigurasi
            </div>
            <div class="text-caption mb-2" style="color: #475569">
              <strong>Region:</strong> Nama wilayah atau cabang
            </div>
            <div class="text-caption mb-2" style="color: #475569">
              <strong>Code:</strong> Kode khusus untuk identifikasi
            </div>
            <div class="text-caption" style="color: #475569">
              <strong>Shared Secret:</strong> Kunci rahasia untuk enkripsi
            </div>
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
import ApiService from "../services/api.js";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "AddConfigComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      // Configuration data
      config: {
        configId: "",
        region: "",
        code: "",
        sharedSecret: "",
      },
      // UI states
      loading: false,
      showSharedSecret: false,
      alertMessage: "",
      alertType: "success",
      submitSuccess: false, // Add success state for visual feedback
      // Form validation rules
      rules: {
        required: (value) => !!value || "Field ini wajib diisi",
        minLength: (min) => (value) =>
          value?.length >= min || `Minimal ${min} karakter`,
      },
    };
  },
  methods: {
    // Add new configuration
    async handleAddConfig() {
      if (!this.$refs.configForm.validate()) {
        return;
      }

      this.loading = true;

      try {
        // Log payload untuk debugging
        console.log("Sending config payload:", this.config);

        const response = await ApiService.setConfig(this.config);
        console.log("API Response received:", response);

        // Check for various success indicators
        if (
          response &&
          (response.success === true ||
            response.status === "success" ||
            response.message === "Configuration saved successfully" ||
            !response.error)
        ) {
          this.submitSuccess = true;
          this.showAlert("Konfigurasi berhasil ditambahkan!", "success");

          // Reset form after a short delay to show success state
          setTimeout(() => {
            this.resetForm();
            this.submitSuccess = false;
          }, 1500);
        } else if (response && response.error) {
          // Handle specific error from API
          this.showAlert(
            response.error ||
              response.message ||
              "Gagal menambahkan konfigurasi",
            "error"
          );
        } else if (response && response.message) {
          // Handle case where there's a message but unclear success status
          this.showAlert(response.message, "warning");
        } else {
          // Default success case if we get any response without explicit error
          this.submitSuccess = true;
          this.showAlert("Konfigurasi berhasil ditambahkan!", "success");

          // Reset form after a short delay
          setTimeout(() => {
            this.resetForm();
            this.submitSuccess = false;
          }, 1500);
        }
      } catch (error) {
        console.error("Config add error:", error);
        this.showAlert(`Terjadi kesalahan: ${error.message || error}`, "error");
      } finally {
        this.loading = false;
      }
    },

    // Reset form
    resetForm() {
      this.config = {
        configId: "",
        region: "",
        code: "",
        sharedSecret: "",
      };
      this.submitSuccess = false; // Reset success state
      if (this.$refs.configForm) {
        this.$refs.configForm.resetValidation();
      }
    },

    // Fill sample data for testing
    fillSampleData() {
      this.config = {
        configId: "0",
        region: "jakarta",
        code: "1312",
        sharedSecret: "asdasd",
      };
    },

    // Show alert message
    showAlert(message, type = "success") {
      this.alertMessage = message;
      this.alertType = type;

      // Log alert for debugging
      console.log(`Alert shown: ${type} - ${message}`);

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

/* Status indicators */
.text-caption {
  line-height: 1.4;
}

/* Responsive form layout */
@media (max-width: 959px) {
  /* Medium screens and below */
  .v-btn .v-icon {
    margin-right: 4px !important;
  }
}

@media (max-width: 767px) {
  .v-container {
    padding: 12px !important;
  }

  .v-card-text {
    padding: 16px !important;
  }

  /* Stack form and sidebar vertically on mobile */
  .v-row .v-col:first-child {
    order: 1;
  }

  .v-row .v-col:last-child {
    order: 2;
    margin-top: 16px;
  }
}

@media (max-width: 599px) {
  /* Extra small screens - make buttons more compact */
  .v-btn {
    font-size: 0.875rem !important;
    min-height: 40px !important;
  }

  .v-btn .v-icon {
    font-size: 18px !important;
    margin-right: 2px !important;
  }

  /* Ensure text doesn't overflow */
  .v-btn span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  /* Very small screens - stack buttons vertically with smaller text */
  .v-btn {
    font-size: 0.8rem !important;
    min-height: 36px !important;
    padding: 0 8px !important;
  }

  .v-btn .v-icon {
    font-size: 16px !important;
  }
}

/* Ensure proper spacing between form sections */
.v-divider {
  margin: 24px 0 !important;
}

@media (max-width: 767px) {
  .v-divider {
    margin: 16px 0 !important;
  }
}

/* Enhanced form validation colors */
.v-card .v-icon.text-success {
  color: #2e7d32 !important; /* Darker green for better contrast */
}

.v-card .font-weight-medium {
  color: #1e293b !important; /* Darker text for field names */
}

/* Success state styling for validation items */
.validation-item-success {
  background-color: rgba(46, 125, 50, 0.1);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  border-left: 4px solid #2e7d32;
}

.validation-item-success .v-icon {
  color: #2e7d32 !important;
}

.validation-item-success .font-weight-medium {
  color: #2e7d32 !important;
  font-weight: 600;
}

/* Enhanced sample button styling */
.sample-btn {
  background: linear-gradient(45deg, #ff9800 0%, #ff5722 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4) !important;
  transition: all 0.3s ease !important;
}

.sample-btn:hover {
  background: linear-gradient(45deg, #f57c00 0%, #e64a19 100%) !important;
  box-shadow: 0 6px 16px rgba(255, 152, 0, 0.6) !important;
  transform: translateY(-2px) !important;
}

.sample-btn:active {
  transform: translateY(0px) !important;
}

.sample-btn .v-icon {
  color: white !important;
}
</style>
