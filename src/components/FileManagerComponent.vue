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
          <v-card-title class="pb-2">
            <v-icon class="text-blue mr-2">mdi-file-multiple</v-icon>
            List File
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="file in files"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FileManagerComponent",
  data() {
    return {
      googleDriveUrl:
        "https://drive.google.com/drive/u/0/folders/1BFe44vui_pfA_QZpq_Vi-nzghakoOpSghjasdaa-adrjakf0ggjbasdfu-asf",
      selectedFile: null,
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

.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
