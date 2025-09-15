<template>
  <div class="about-page-full">
    <!-- Hero Section -->
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-card
          elevation="0"
          class="gradient-primary text-white text-center"
          height="300"
          rounded="0"
        >
          <v-card-text
            class="d-flex flex-column justify-center align-center h-100"
          >
            <v-icon size="80" class="mb-4 text-shadow">mdi-bank</v-icon>
            <h1 class="text-h3 font-weight-bold text-shadow mb-3">
              Branch Dashboard
            </h1>
            <p class="text-h6 text-shadow opacity-90 max-width-600">
              Solusi digital modern untuk mengelola operasional cabang dengan
              efisien dan profesional
            </p>
            <v-btn
              variant="outlined"
              color="white"
              size="large"
              class="mt-4"
              prepend-icon="mdi-rocket-launch"
              @click="$router.push('/')"
            >
              Mulai Sekarang
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-row class="ma-0">
      <v-col cols="12" class="pa-6">
        <h2 class="text-h4 text-center mb-6 font-weight-bold text-primary">
          <v-icon left size="large" color="primary">mdi-star-circle</v-icon>
          Fitur Unggulan
        </h2>
      </v-col>

      <v-col
        cols="12"
        md="4"
        class="pa-3"
        v-for="feature in features"
        :key="feature.title"
      >
        <v-card
          elevation="4"
          class="h-100 feature-card"
          :class="`${feature.color}-lighten-5`"
        >
          <v-card-text class="text-center pa-6">
            <v-avatar size="80" :color="feature.color" class="mb-4">
              <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-3">{{ feature.title }}</h3>
            <p class="text-body-1 text-grey-darken-1">
              {{ feature.description }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Technology Stack Section -->
    <v-row class="ma-0 bg-grey-lighten-5">
      <v-col cols="12" class="pa-6">
        <v-card elevation="4" rounded="xl">
          <v-card-title class="text-h5 text-center pa-6 bg-grey-lighten-4">
            <v-icon left color="primary" size="large">mdi-code-tags</v-icon>
            Teknologi yang Digunakan
          </v-card-title>
          <v-card-text class="pa-8">
            <v-row>
              <v-col
                cols="12"
                md="6"
                lg="3"
                v-for="tech in technologies"
                :key="tech.name"
              >
                <v-card
                  variant="outlined"
                  class="text-center h-100"
                  :class="`${tech.color}-lighten-5`"
                >
                  <v-card-text class="pa-4">
                    <v-icon :color="tech.color" size="60" class="mb-3">
                      {{ tech.icon }}
                    </v-icon>
                    <h4 class="text-h6 font-weight-bold mb-2">
                      {{ tech.name }}
                    </h4>
                    <p class="text-body-2 text-grey-darken-1">
                      {{ tech.description }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- About Section -->
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0 pb-0">
        <v-card elevation="4" rounded="xl">
          <v-card-title class="text-h5 text-center pa-6 bg-grey-lighten-4">
            <v-icon left color="info" size="large">mdi-information</v-icon>
            Tentang Aplikasi
          </v-card-title>
          <v-card-text class="pa-8">
            <v-row>
              <v-col cols="12" md="8" class="mx-auto">
                <p class="text-h6 text-center mb-4 font-weight-medium">
                  Branch Dashboard
                </p>
                <p class="text-body-1 text-center mb-6 text-grey-darken-1">
                  Aplikasi ini dibangun menggunakan teknologi modern untuk
                  memberikan pengalaman pengguna yang optimal dalam mengelola
                  operasional cabang. Dengan antarmuka yang intuitif dan
                  performa yang tinggi, aplikasi ini dirancang untuk
                  meningkatkan efisiensi kerja dan produktivitas tim.
                </p>

                <div class="text-center">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-home"
                    @click="$router.push('/')"
                    class="mr-4"
                  >
                    Kembali ke Dashboard
                  </v-btn>

                  <v-btn
                    color="success"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-github"
                  >
                    Lihat Source Code
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Custom Footer for About page -->
        <div class="gradient-primary text-center pa-4 mt-0">
          <div class="text-white text-shadow">
            <v-icon class="mr-2">mdi-copyright</v-icon>
            {{ new Date().getFullYear() }} - Branch Dashboard.
            <span class="ml-1 font-weight-medium">
              Built with Vue 3 + Vuetify 3
            </span>
            <v-icon class="ml-2 text-red">mdi-heart</v-icon>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    title: "Responsive Design",
    description:
      "Tampilan yang optimal di semua perangkat, dari desktop hingga mobile",
    icon: "mdi-responsive",
    color: "primary",
  },
  {
    title: "Material Design",
    description: "Antarmuka modern mengikuti standar Google Material Design",
    icon: "mdi-material-design",
    color: "success",
  },
  {
    title: "Performa Tinggi",
    description:
      "Loading cepat dan interaksi yang smooth untuk pengalaman terbaik",
    icon: "mdi-speedometer",
    color: "warning",
  },
]);

const technologies = ref([
  {
    name: "Vue 3",
    description: "Progressive JavaScript Framework",
    icon: "mdi-vuejs",
    color: "success",
  },
  {
    name: "Vite",
    description: "Fast Build Tool",
    icon: "mdi-lightning-bolt",
    color: "primary",
  },
  {
    name: "Vuetify 3",
    description: "Material Component Framework",
    icon: "mdi-material-design",
    color: "info",
  },
  {
    name: "Vue Router",
    description: "Client-side Routing",
    icon: "mdi-router",
    color: "warning",
  },
]);
</script>

<style scoped>
.about-page-full {
  width: 100vw;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: transparent;
}

.feature-card {
  transition: transform 0.3s ease-in-out;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.max-width-600 {
  max-width: 600px;
  margin: 0 auto;
}

/* Remove all default spacing completely */
:deep(.v-container) {
  padding: 0 !important;
  margin: 0 !important;
  max-width: none !important;
  width: 100% !important;
}

/* Ensure full width layout */
:deep(.v-row) {
  margin: 0 !important;
  width: 100% !important;
}

:deep(.v-col) {
  padding: 0 !important;
}

/* Override Vuetify's main content padding */
:deep(.v-main) {
  padding: 0 !important;
}

/* Ensure no gaps */
* {
  box-sizing: border-box;
}
</style>
