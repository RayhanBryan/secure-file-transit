<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="gradient-primary text-white" elevation="4" rounded="xl">
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="8">
                <div class="d-flex align-center mb-3">
                  <v-avatar size="60" color="white" class="mr-4">
                    <v-icon size="30" color="primary"
                      >mdi-account-circle</v-icon
                    >
                  </v-avatar>
                  <div>
                    <h1 class="text-h4 font-weight-bold text-shadow mb-1">
                      Selamat datang, {{ user?.name || "User" }}!
                    </h1>
                    <p class="text-h6 text-shadow opacity-90 mb-0">
                      {{ user?.branch || "Dashboard Cabang BRI" }}
                    </p>
                  </div>
                </div>
                <p class="text-body-1 text-shadow opacity-90 mb-0">
                  {{ getCurrentGreeting() }} Semoga hari Anda produktif dan
                  menyenangkan.
                </p>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <v-chip
                  :color="user?.role === 'admin' ? 'warning' : 'success'"
                  variant="elevated"
                  size="large"
                  class="text-white font-weight-bold"
                >
                  <v-icon left>{{
                    user?.role === "admin" ? "mdi-shield-crown" : "mdi-account"
                  }}</v-icon>
                  {{ user?.role === "admin" ? "Administrator" : "User" }}
                </v-chip>
                <div class="mt-3 text-caption text-shadow opacity-80">
                  Login: {{ getCurrentTime() }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="text-center py-8" elevation="2" color="primary" dark>
          <v-card-title class="text-h3 font-weight-bold mb-2">
            <v-icon left size="48" class="mr-4">mdi-view-dashboard</v-icon>
            Dashboard Cabang BRI
          </v-card-title>
          <v-card-subtitle class="text-h6 opacity-90">
            Sistem Manajemen Dashboard untuk Cabang BRI
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Feature Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card elevation="3" hover class="h-100 feature-card">
          <v-card-title class="text-h5 pb-2">
            <v-icon left color="success" size="32">mdi-chart-line</v-icon>
            Analytics
          </v-card-title>
          <v-card-text class="pb-4">
            <p class="text-body-1">
              Lihat statistik dan analisis performa cabang secara real-time
              dengan dashboard interaktif.
            </p>
            <v-chip color="success" size="small" variant="tonal">
              Real-time
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" variant="tonal" block>
              Buka Analytics
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" hover class="h-100 feature-card">
          <v-card-title class="text-h5 pb-2">
            <v-icon left color="primary" size="32">mdi-account-group</v-icon>
            Manajemen User
          </v-card-title>
          <v-card-text class="pb-4">
            <p class="text-body-1">
              Kelola user, role, dan permission dengan sistem yang terintegrasi
              dan aman.
            </p>
            <v-chip color="primary" size="small" variant="tonal">
              Secure
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" block>
              Kelola User
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" hover class="h-100 feature-card">
          <v-card-title class="text-h5 pb-2">
            <v-icon left color="warning" size="32">mdi-cog</v-icon>
            Pengaturan
          </v-card-title>
          <v-card-text class="pb-4">
            <p class="text-body-1">
              Konfigurasi sistem, backup data, dan pengaturan lainnya untuk
              optimasi performa.
            </p>
            <v-chip color="warning" size="small" variant="tonal">
              System
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="warning" variant="tonal" block>
              Pengaturan
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- System Information -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text-h5 pb-3">
            <v-icon left color="info">mdi-information</v-icon>
            Informasi Sistem
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="h-100">
                  <v-card-title class="text-h6 bg-grey-lighten-4">
                    <v-icon left>mdi-code-tags</v-icon>
                    Teknologi
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-chip-group column>
                      <v-chip
                        color="success"
                        variant="tonal"
                        prepend-icon="mdi-vuejs"
                        size="large"
                      >
                        Vue 3
                      </v-chip>
                      <v-chip
                        color="primary"
                        variant="tonal"
                        prepend-icon="mdi-lightning-bolt"
                        size="large"
                      >
                        Vite
                      </v-chip>
                      <v-chip
                        color="info"
                        variant="tonal"
                        prepend-icon="mdi-material-design"
                        size="large"
                      >
                        Vuetify 3
                      </v-chip>
                      <v-chip
                        color="warning"
                        variant="tonal"
                        prepend-icon="mdi-router"
                        size="large"
                      >
                        Vue Router 4
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="h-100">
                  <v-card-title class="text-h6 bg-grey-lighten-4">
                    <v-icon left>mdi-star</v-icon>
                    Fitur Utama
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-list density="comfortable">
                      <v-list-item prepend-icon="mdi-responsive" class="px-0">
                        <v-list-item-title class="font-weight-medium">
                          Responsive Design
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Optimal di semua perangkat
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-palette" class="px-0">
                        <v-list-item-title class="font-weight-medium">
                          Material Design
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          UI modern dan konsisten
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-speedometer" class="px-0">
                        <v-list-item-title class="font-weight-medium">
                          Performa Tinggi
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Fast loading dan smooth
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-puzzle" class="px-0">
                        <v-list-item-title class="font-weight-medium">
                          Modular Components
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Komponen yang reusable
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi!";
  if (hour < 17) return "Selamat siang!";
  if (hour < 21) return "Selamat sore!";
  return "Selamat malam!";
};

const getCurrentTime = () => {
  return new Date().toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  // Load user data
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}

.feature-card {
  transition: transform 0.3s ease-in-out;
}

.feature-card:hover {
  transform: translateY(-4px);
}
</style>
