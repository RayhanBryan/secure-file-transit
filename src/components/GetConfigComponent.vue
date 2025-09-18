<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon left size="large" color="primary">mdi-cog</v-icon>
          Configuration Management } catch (error) { this.showAlert("Failed to
          save configuration", "error");
        </h2>
        <p class="text-subtitle-1 text-grey-darken-3">
          Manage system configuration - view and add new configurations
        </p>
      </v-col>
    </v-row>

    <!-- Combined Management Row: Left (List) - Right (Add Config Form) -->
    <v-row>
      <!-- Left Column: Config List -->
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg" class="h-100">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-cog-outline</v-icon>
            Configuration List
          </v-card-title>
          <v-card-text class="pa-4">
            <!-- Search and Refresh Section -->
            <div class="d-flex mb-4 gap-2">
              <v-text-field
                v-model="searchQuery"
                label="Search configuration..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                class="flex-grow-1 me-2"
                clearable
                @input="searchConfigs"
              ></v-text-field>
              <v-btn
                color="primary"
                variant="outlined"
                @click="loadConfig"
                :loading="loading"
                density="compact"
                height="40"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>

            <!-- Configuration Display -->
            <div v-if="configData && filteredConfigData.length > 0">
              <v-data-table
                :headers="configHeaders"
                :items="filteredConfigData"
                :loading="loading"
                item-key="configId"
                class="elevation-1"
                density="compact"
              >
                <template v-slot:item.configId="{ item }">
                  <v-chip
                    v-if="item.configId"
                    color="primary"
                    variant="elevated"
                    size="small"
                  >
                    {{ item.configId }}
                  </v-chip>
                  <span v-else class="text-grey">-</span>
                </template>
                <template v-slot:item.region="{ item }">
                  <v-chip
                    v-if="item.region"
                    color="black"
                    variant="tonal"
                    size="small"
                  >
                    {{ item.region }}
                  </v-chip>
                  <span v-else class="text-grey">-</span>
                </template>
              </v-data-table>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2">mdi-cog-off</v-icon>
              <p class="text-h6 text-grey mt-2">No configurations</p>
              <p class="text-body-2 text-grey">
                Please load configuration or add new configuration
              </p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
              <p class="text-body-2 text-grey mt-2">
                Loading configurations...
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Add Config Form -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="mb-4 add-config-card">
          <v-card-title class="pb-2">
            <v-icon class="text-primary mr-2">mdi-plus-box</v-icon>
            Add Configuration
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form
              @submit.prevent="handleAddConfig"
              ref="configForm"
              v-model="formValid"
            >
              <v-text-field
                v-model="newConfig.region"
                label="Region"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                density="comfortable"
                :rules="regionRules"
                required
                class="mb-3"
                hint="Region/area name"
              ></v-text-field>

              <v-text-field
                v-model="newConfig.code"
                label="Code"
                prepend-inner-icon="mdi-code-tags"
                variant="outlined"
                density="comfortable"
                :rules="codeRules"
                required
                class="mb-3"
                hint="Identification code"
              ></v-text-field>

              <v-row class="mt-2">
                <v-col cols="6" md="12">
                  <v-btn
                    color="blue-grey-lighten-1"
                    variant="elevated"
                    size="large"
                    block
                    @click="resetConfigForm"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    Reset
                  </v-btn>
                </v-col>
                <v-col cols="6" md="12">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    block
                    type="submit"
                    :loading="saving"
                    :disabled="!formValid || saving"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Add Config
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alert Component -->
    <AlertComponent
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />
  </v-container>
</template>

<script>
import ConfigApiService from "@/services/configApi";
import AlertComponent from "./shared/AlertComponent.vue";

export default {
  name: "Configs",
  components: {
    AlertComponent,
  },
  data() {
    return {
      loading: false,
      configData: null,
      alertMessage: "",
      alertType: "success",
      searchQuery: "",
      // Add config form state
      formValid: false,
      saving: false,
      newConfig: {
        region: "",
        code: "",
      },
      regionRules: [
        (v) => !!v || "Region is required",
        (v) => (v && v.length >= 2) || "Region minimum 2 characters",
      ],
      codeRules: [
        (v) => !!v || "Code is required",
        (v) => (v && v.length >= 2) || "Code minimum 2 characters",
      ],
      configHeaders: [
        { title: "Config ID", key: "configId", sortable: true, width: "120px" },
        { title: "Region", key: "region", sortable: true },
        { title: "Code", key: "code", sortable: true, width: "120px" },
      ],
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
          config.code?.toLowerCase().includes(query)
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
        const response = await ConfigApiService.getConfig();

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

        this.showAlert("Configuration loaded successfully", "success");
      } catch (error) {
        this.showAlert("Failed to load configuration", "error");
        this.configData = null;
      } finally {
        this.loading = false;
      }
    },

    // Add config methods
    async handleAddConfig() {
      if (!this.$refs.configForm.validate()) {
        return;
      }

      this.saving = true;
      try {
        const response = await ConfigApiService.setConfig(this.newConfig);

        if (
          response &&
          (response.success === true ||
            response.status === "success" ||
            response.message === "Configuration saved successfully" ||
            !response.error)
        ) {
          this.showAlert("Configuration added successfully", "success");
          this.resetConfigForm();
          // Refresh config list
          this.loadConfig();
        } else {
          throw new Error(response?.message || "Failed to save configuration");
        }
      } catch (error) {
        this.showAlert("Failed to add configuration", "error");
      } finally {
        this.saving = false;
      }
    },

    resetConfigForm() {
      this.newConfig = {
        region: "",
        code: "",
      };
      if (this.$refs.configForm) {
        this.$refs.configForm.resetValidation();
      }
    },

    searchConfigs() {
      // This will trigger the computed property filteredConfigData
      // No additional logic needed as it's handled in computed
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
/* Add config card styling */
.add-config-card :deep(.v-text-field),
.add-config-card :deep(.v-select) {
  margin-bottom: 8px;
}

.add-config-card :deep(.v-field) {
  border-radius: 8px;
}

.add-config-card {
  height: fit-content;
}

.v-data-table {
  border-radius: 8px;
}
</style>
