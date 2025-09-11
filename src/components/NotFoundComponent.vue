<template>
  <div class="not-found-page">
    <v-container fluid class="fill-height">
      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- 404 Card -->
          <v-card elevation="12" class="mx-auto not-found-card" rounded="xl">
            <!-- Header Section -->
            <div class="gradient-primary text-center pa-8">
              <div class="error-number mb-4">
                <span class="text-h1 font-weight-bold text-white">404</span>
              </div>
              <h1 class="text-h4 font-weight-bold text-white text-shadow mb-2">
                Page Not Found
              </h1>
              <p class="text-subtitle-1 text-white text-shadow opacity-90">
                Sorry, the page you're looking for can't be found
              </p>
            </div>

            <!-- Content Section -->
            <v-card-text class="pa-8 text-center">
              <v-avatar size="120" class="mb-6" color="grey-lighten-4">
                <v-icon size="80" color="grey-darken-2"
                  >mdi-map-marker-question</v-icon
                >
              </v-avatar>

              <h2 class="text-h5 font-weight-bold text-primary mb-4">
                Oops! Looks like you're lost
              </h2>

              <p class="text-body-1 text-grey-darken-1 mb-6">
                The page you are looking for may have been moved, deleted, or
                the URL is incorrect.
              </p>

              <!-- Suggestions -->
              <v-card
                variant="tonal"
                color="primary"
                class="mb-6 pa-4"
                rounded="lg"
              >
                <h3 class="text-h6 font-weight-medium text-primary mb-3">
                  <v-icon left color="primary">mdi-lightbulb</v-icon>
                  Suggestions for you:
                </h3>
                <ul class="text-left text-primary suggestion-list ms-4">
                  <li class="mb-1">Double-check the URL you entered</li>
                  <li class="mb-1">Go back to the previous page</li>
                  <li class="mb-1">Use the navigation menu to find a page</li>
                  <li>Contact the administrator if the problem persists</li>
                </ul>
              </v-card>

              <!-- Action Buttons -->
              <div class="d-flex flex-column flex-sm-row gap-3 justify-center">
                <v-btn
                  color="grey-darken-2"
                  variant="outlined"
                  size="large"
                  @click="goBack"
                  class="px-8"
                  rounded="lg"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Previous Page
                </v-btn>
              </div>
            </v-card-text>

            <!-- Footer -->
            <v-card-actions class="px-8 pb-8">
              <div class="w-100 text-center">
                <v-divider class="mb-4"></v-divider>
                <p class="text-caption text-grey-darken-1">
                  If you believe this page should exist, please contact the
                  support team
                </p>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  @click="reportProblem"
                >
                  <v-icon left size="small">mdi-bug</v-icon>
                  Report an Issue
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <!-- Additional Info -->
          <div class="text-center mt-6">
            <v-card variant="tonal" color="info" class="pa-4" rounded="lg">
              <v-icon color="info" class="mb-2">mdi-clock</v-icon>
              <p class="text-body-2 text-info mb-2 font-weight-medium">
                Time: {{ currentTime }}
              </p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "NotFoundComponent",
  data() {
    return {
      currentTime: "",
      timeInterval: null,
    };
  },
  mounted() {
    this.updateCurrentTime();
    this.startTimeUpdate();
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.goHome();
      }
    },

    reportProblem() {
      // You can customize this to open a support ticket or email
      const subject = encodeURIComponent("404 Page Issue - BRI Dashboard");
      const body = encodeURIComponent(`I encountered a missing page (404).

Accessed URL: ${window.location.href}
Time: ${new Date().toLocaleString("en-US")}
Browser: ${navigator.userAgent}

Please assist in resolving this issue.`);

      window.open(
        `mailto:it-support@bri.co.id?subject=${subject}&body=${body}`
      );
    },

    startTimeUpdate() {
      this.timeInterval = setInterval(() => {
        this.updateCurrentTime();
      }, 1000);
    },

    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.not-found-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.not-found-card {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.fill-height {
  min-height: 100vh;
}

.gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.error-number {
  position: relative;
}

.error-number::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: -1;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.gap-3 {
  gap: 12px;
}

/* Button hover effects */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Responsive design */
@media (max-width: 600px) {
  .not-found-card {
    margin: 16px;
  }

  .error-number .text-h1 {
    font-size: 4rem !important;
  }

  .d-flex.flex-column.flex-sm-row {
    flex-direction: column;
  }

  .d-flex.flex-column.flex-sm-row .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* Animation for the avatar */
.v-avatar {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Enhanced visibility for suggestion list */
.suggestion-list {
  font-weight: 500;
}

.suggestion-list li {
  color: #1565c0 !important;
  font-size: 0.95rem;
  line-height: 1.6;
}

.suggestion-list li:hover {
  color: #0d47a1 !important;
  font-weight: 600;
}
</style>
