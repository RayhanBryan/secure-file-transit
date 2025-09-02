<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-file-document</v-icon>
          Pesan File
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Pesan file CSV untuk diproses oleh sistem
        </p>
      </v-col>
    </v-row>

    <!-- Main Action Card -->
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="text-center pa-8">
          <v-card-title class="pb-4 justify-center">
            <v-icon class="text-primary mr-2" size="48">mdi-cart</v-icon>
          </v-card-title>
          <v-card-text>
            <h3 class="text-h5 font-weight-bold mb-4 text-primary">
              Order File CSV
            </h3>
            <p class="text-body-1 text-grey-darken-1 mb-6">
              Klik tombol di bawah ini untuk memesan file CSV dari sistem
            </p>

            <v-btn
              color="primary"
              variant="elevated"
              size="x-large"
              @click="orderCsvFile"
              :loading="ordering"
              class="px-12 py-4"
              rounded="lg"
            >
              <v-icon left size="24">mdi-cart-plus</v-icon>
              Order File CSV
            </v-btn>
            <!-- Success/Error Alerts -->

            <!-- Success state with Status ID display -->
            <div v-if="orderSuccess" class="mt-6">
              <!-- Status ID Card -->
              <v-card
                v-if="statusId"
                elevation="1"
                rounded="lg"
                color="success"
                variant="tonal"
                class="mb-4"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="success" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    <span class="text-h6 font-weight-bold order-success-text">
                      Order Berhasil Dibuat
                    </span>
                  </div>

                  <div class="status-id-container">
                    <p class="text-caption text-grey-darken-1 mb-2 text-center">
                      ID Status Pemrosesan:
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
                            :title="copied ? 'Tersalin!' : 'Salin ID'"
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
                      Salin ID ini untuk melacak status pemrosesan file
                    </p>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Navigate to status button -->
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                @click="goToGetStatus"
                class="px-8 status-button"
                rounded="lg"
              >
                <v-icon left color="white">mdi-eye</v-icon>
                <span class="button-text">Lihat Status Pemrosesan</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Status Info -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="1" rounded="lg" color="info" variant="tonal">
          <v-card-text class="text-center pa-4">
            <v-icon color="info" class="mb-2">mdi-information</v-icon>
            <p class="text-body-2 mb-0">
              File CSV akan diproses setelah order berhasil dibuat
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AlertComponent
      v-if="alertMessage && !orderSuccess"
      :type="alertType"
      :message="alertMessage"
      class="mt-4"
    />
    <AlertComponent
      v-if="orderSuccess"
      type="success"
      message="Order CSV berhasil! File sedang diproses."
      class="mb-4"
    />
  </v-container>
</template>

<script>
import ApiService from "@/services/api";
import AlertComponent from "@/components/shared/AlertComponent.vue";

export default {
  name: "OrderFileComponent",
  components: {
    AlertComponent,
  },
  data() {
    return {
      ordering: false,
      orderSuccess: false,
      statusId: "",
      copied: false,
      alertMessage: "",
      alertType: "success",
    };
  },
  methods: {
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
              "Order CSV berhasil dibuat! File sedang diproses.",
              "success"
            );
          } else {
            this.showAlert("Order CSV berhasil dibuat!", "success");
            this.orderSuccess = true;
          }
        } else {
          this.showAlert("Order CSV berhasil dibuat!", "success");
          this.orderSuccess = true;
        }
      } catch (error) {
        console.error("Error ordering CSV:", error);
        this.showAlert("Gagal membuat order CSV", "error");
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
        this.showAlert("ID status berhasil disalin!", "success");

        // Reset copy status after 2 seconds
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
        this.showAlert("Gagal menyalin ID status", "error");
      }
    },

    goToGetStatus() {
      // Navigate to get-status page
      this.$router.push("/get-status");
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

/* Status button styling */
.status-button {
  background-color: #1976d2 !important;
  color: white !important;
  box-shadow: 0 3px 10px rgba(25, 118, 210, 0.3) !important;
  transition: all 0.3s ease !important;
}

.status-button:hover {
  background-color: #1565c0 !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 118, 210, 0.4) !important;
}

.button-text {
  color: white !important;
  font-weight: 600;
  font-size: 1rem;
}

/* Icon color override */
.status-button .v-icon {
  color: white !important;
}

/* Status ID styling */
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

/* Copy button hover effect */
.id-display-wrapper .v-btn:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

/* Copy button icon styling for better contrast */
.id-display-wrapper .v-btn .v-icon {
  transition: all 0.3s ease;
}

.id-display-wrapper .v-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Custom copy button styling */
.id-display-wrapper .v-btn {
  border-radius: 8px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.id-display-wrapper .v-btn:hover {
  background-color: rgba(25, 118, 210, 0.15) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

/* Order success text styling for better contrast */
.order-success-text {
  color: #1b5e20 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}
</style>
