<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-bank</v-icon>
          Cabang BRI Pejaten
        </h2>
        <p class="text-subtitle-1 text-grey-darken-1">
          File Management System untuk Cabang BRI Pejaten
        </p>
      </v-col>
    </v-row>

    <!-- URL Folder BRIDrive Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2">
            <v-icon class="text-green mr-2">mdi-folder</v-icon>
            URL Folder BRIDrive
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="googleDriveUrl"
                  readonly
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="copyToClipboard"
                  block
                >
                  <v-icon left size="16">mdi-content-copy</v-icon>
                  Copy
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="4">
                <v-btn color="grey" variant="outlined" block size="large">
                  <v-icon left>mdi-download</v-icon>
                  Download URL
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- List File Section -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="pb-2 mb-2">
            <v-icon class="text-blue mr-2">mdi-file-multiple</v-icon>
            List File
          </v-card-title>
          <v-card-text>
            <!-- Search Bar -->
            <v-row>
              <v-col cols="12" md="12" class="pb-1">
                <v-text-field
                  v-model="searchQuery"
                  variant="outlined"
                  density="compact"
                  placeholder="Cari file..."
                  hide-details
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon>mdi-magnify</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- File Grid -->
            <v-row>
              <v-col
                v-for="file in filteredFiles"
                :key="file.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  variant="outlined"
                  hover
                  class="file-card"
                  @click="selectFile(file)"
                  :class="{ 'selected-file': selectedFile?.name === file.name }"
                >
                  <v-card-text class="text-center py-4">
                    <v-icon size="48" color="grey-darken-1" class="mb-2">
                      mdi-file-delimited
                    </v-icon>
                    <div class="file-name text-body-2 font-weight-medium">
                      {{ file.name }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- No Results Message -->
            <v-row v-if="filteredFiles.length === 0 && searchQuery">
              <v-col cols="12" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">
                  mdi-file-search-outline
                </v-icon>
                <h3 class="text-h6 text-grey-darken-1 mb-2">
                  Tidak ada file ditemukan
                </h3>
                <p class="text-body-2 text-grey-darken-1">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "BRIDriveComponent",
  data() {
    return {
      googleDriveUrl:
        "https://drive.google.com/drive/u/0/folders/1BFe44vui_pfA_QZpq_Vi-nzghakoOpSghjasdaa-adrjakf0ggjbasdfu-asf",
      selectedFile: null,
      searchQuery: "",
      files: [
        { name: "reporting.csv", type: "csv" },
        { name: "reporting-2024.csv", type: "csv" },
        { name: "finance-rekap.csv", type: "csv" },
        { name: "reporting.csv", type: "csv" },
        { name: "bi-checking.csv", type: "csv" },
        { name: "credit_score.csv", type: "csv" },
      ],
    };
  },
  computed: {
    filteredFiles() {
      if (!this.searchQuery) {
        return this.files;
      }
      return this.files.filter((file) =>
        file.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    selectFile(file) {
      this.selectedFile = file;
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.googleDriveUrl);
        console.log("URL copied to clipboard");
        // You can add a toast notification here
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    },
    searchFiles() {
      // Method untuk trigger search (sudah otomatis dengan computed property)
      // Bisa ditambahkan logic tambahan seperti analytics atau logging
      console.log(`Searching for: ${this.searchQuery}`);
      if (this.filteredFiles.length === 0 && this.searchQuery) {
        console.log("No files found for the search query");
      }
    },
  },
};
</script>

<style scoped>
.text-green {
  color: #10b981 !important;
}

.text-blue {
  color: #60a5fa !important;
}

.file-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.selected-file {
  border-color: #1976d2 !important;
  background-color: #e3f2fd !important;
}

.file-name {
  word-break: break-word;
  max-width: 100%;
}

.search-btn {
  height: 40px !important;
  font-weight: 600;
}

.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
