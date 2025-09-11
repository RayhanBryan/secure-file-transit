<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-book-open</v-icon>
          Secure File Transit - Guide
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Usage guide for Secure File Transit Portal for BRI Pejaten Branch
        </p>
      </v-col>
    </v-row>

    <!-- Guide Content -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2"
              >mdi-book-open-page-variant</v-icon
            >
            Guide
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- Guide Description -->
            <div class="mb-6">
              <p
                class="text-body-1 text-justify mb-4"
                style="line-height: 1.8; color: #1e293b"
              >
                Portal Secure File Transit merupakan sebuah middleware yang
                dirancang untuk menjamin keamanan transmisi serta mengelola
                akses terhadap file CSV yang telah terenkripsi. Portal ini
                dikelola oleh user cabang atau instansi (contoh:
                <strong>Cabang BRI Pejaten</strong>) untuk melakukan proses
                decrypt file CSV secara offline menggunakan key yang telah
                disediakan sebelumnya. Dengan platform ini, file terenkripsi
                yang diunduh melalui link drive hanya dapat dibuka dan
                didekripsi oleh user yang memiliki installer decryptor dan
                key-cache file yang valid.
              </p>
            </div>

            <!-- User Guide Download Section -->
            <div class="mb-4">
              <v-row align="center">
                <v-col cols="12" md="8">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" size="24" class="mr-3">
                      mdi-file-document-outline
                    </v-icon>
                    <span
                      class="text-body-1 font-weight-medium"
                      style="color: #1e293b"
                    >
                      >User Guide</span
                    >
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    size="large"
                    @click="downloadUserGuide"
                    block
                    class="guide-btn"
                  >
                    <v-icon left>mdi-download</v-icon>
                    Download
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Instructions Section -->
            <div class="mb-4">
              <h3 class="text-h6 font-weight-bold mb-4 text-primary">
                📋 Langkah-langkah Penggunaan
              </h3>

              <v-timeline density="compact" class="custom-timeline">
                <v-timeline-item
                  v-for="(step, index) in guideSteps"
                  :key="index"
                  :dot-color="step.color"
                  size="small"
                  class="mb-3"
                >
                  <div class="timeline-content">
                    <h4
                      class="text-subtitle-1 font-weight-bold mb-2"
                      style="color: #1e293b"
                    >
                      {{ step.title }}
                    </h4>
                    <p class="text-body-2 mb-0" style="color: #475569">
                      {{ step.description }}
                    </p>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Important Notes -->
            <div class="mb-4">
              <h3 class="text-h6 font-weight-bold mb-4" style="color: #ea580c">
                ⚠️ Catatan Penting
              </h3>

              <v-alert type="warning" variant="tonal" class="mb-4">
                <template v-slot:prepend>
                  <v-icon color="#EA580C">mdi-security</v-icon>
                </template>
                <div>
                  <p class="mb-2 font-weight-medium">Keamanan File:</p>
                  <ul class="ml-4">
                    <li>
                      File CSV yang diunduh sudah terenkripsi untuk keamanan
                    </li>
                    <li>
                      Hanya user dengan installer dan key-cache yang valid dapat
                      mengakses
                    </li>
                    <li>
                      Jangan bagikan key-cache kepada pihak yang tidak berwenang
                    </li>
                  </ul>
                </div>
              </v-alert>

              <v-alert type="info" variant="tonal" class="mb-4">
                <template v-slot:prepend>
                  <v-icon color="#0369A1">mdi-information</v-icon>
                </template>
                <div>
                  <p class="mb-2 font-weight-medium">Persyaratan Sistem:</p>
                  <ul class="ml-4">
                    <li>Installer Decryptor telah diinstall di komputer</li>
                    <li>Key-cache file yang valid tersimpan di sistem</li>
                    <li>Koneksi internet untuk mengunduh file dari drive</li>
                  </ul>
                </div>
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GuideComponent",
  data() {
    return {
      guideSteps: [
        {
          title: "1. Download Installer & Key-Cache",
          description:
            "Unduh installer decryptor dan key-cache file dari Download Center. Pastikan kedua file tersimpan dengan aman.",
          color: "blue",
        },
        {
          title: "2. Install Decryptor",
          description:
            "Jalankan installer decryptor dan ikuti petunjuk instalasi. Pastikan instalasi berhasil sebelum melanjutkan.",
          color: "green",
        },
        {
          title: "3. Setup Key-Cache",
          description:
            "Tempatkan key-cache file di lokasi yang ditentukan oleh aplikasi decryptor untuk autentikasi.",
          color: "orange",
        },
        {
          title: "4. Akses BRIDrive",
          description:
            "Buka halaman BRIDrive dan copy URL folder untuk mengakses file CSV yang terenkripsi.",
          color: "purple",
        },
        {
          title: "5. Download & Decrypt",
          description:
            "Download file CSV terenkripsi dari drive, kemudian gunakan decryptor untuk membuka file tersebut.",
          color: "red",
        },
      ],
    };
  },
  methods: {
    downloadUserGuide() {
      // Simulate user guide download
      console.log("Downloading user guide...");
      this.$emit("show-notification", "Download User Guide dimulai", "info");

      // You can implement actual download logic here
      // For example, triggering download of a PDF file
      const link = document.createElement("a");
      link.href = "/user-guide.pdf"; // Replace with actual file path
      link.download = "BRI_Portal_User_Guide.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
.guide-btn {
  height: 40px !important;
  font-weight: 600;
}

.custom-timeline {
  padding-left: 0;
}

.timeline-content {
  padding-left: 16px;
}

.text-justify {
  text-align: justify;
}

/* Custom styling for better readability */
.v-card-text p {
  margin-bottom: 1rem;
  color: #1e293b;
}

.v-card-text strong {
  color: #0369a1;
  font-weight: 600;
}

.v-card-title {
  color: #1e293b !important;
}

/* Timeline custom styling */
.v-timeline-item {
  padding-bottom: 1.5rem;
}

/* Alert custom styling */
.v-alert ul {
  margin-bottom: 0;
}

.v-alert li {
  margin-bottom: 4px;
  color: #1e293b !important;
}

.v-alert p {
  color: #1e293b !important;
}

.v-alert .font-weight-medium {
  color: #1e293b !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline-content {
    padding-left: 12px;
  }

  .guide-btn {
    margin-top: 12px;
  }
}
</style>
