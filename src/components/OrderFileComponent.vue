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

            <!-- Success state with navigation button -->
            <div v-if="orderSuccess" class="mt-6">
              <AlertComponent
                type="success"
                message="Order CSV berhasil! File sedang diproses."
                class="mb-4"
              />

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
      alertMessage: "",
      alertType: "success",
    };
  },
  methods: {
    async orderCsvFile() {
      this.ordering = true;
      this.orderSuccess = false;
      try {
        const response = await ApiService.getCsv();

        // Check if response contains success message
        if (
          response &&
          response.message &&
          response.message.includes("Succes Ordering CSV File")
        ) {
          this.orderSuccess = true;
          this.showAlert(
            "Order CSV berhasil dibuat! File sedang diproses.",
            "success"
          );
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
</style>
