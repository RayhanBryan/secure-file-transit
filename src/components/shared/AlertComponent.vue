<template>
  <transition name="slide-fade" appear>
    <v-alert
      v-if="message"
      :type="type"
      variant="tonal"
      class="floating-alert custom-alert"
      :class="[
        type === 'error'
          ? 'error-alert'
          : type === 'warning'
          ? 'warning-alert'
          : type === 'info'
          ? 'info-alert'
          : 'success-alert',
      ]"
      rounded="lg"
      :icon="false"
    >
      <template #default>
        <div class="d-flex align-center">
          <v-icon
            :icon="getAlertIcon(type)"
            class="alert-main-icon mr-2"
            size="small"
          ></v-icon>
          <span
            class="alert-text"
            :class="[
              type === 'error'
                ? 'error-text'
                : type === 'warning'
                ? 'warning-text'
                : type === 'info'
                ? 'info-text'
                : 'success-text',
            ]"
          >
            {{ message }}
          </span>
        </div>
      </template>
    </v-alert>
  </transition>
</template>

<script>
export default {
  name: "AlertComponent",
  emits: ["close"],
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "success",
      validator: (value) =>
        ["success", "error", "warning", "info"].includes(value),
    },
  },
  methods: {
    getAlertIcon(type) {
      const icons = {
        success: "mdi-check-circle",
        error: "mdi-alert-circle",
        warning: "mdi-alert",
        info: "mdi-information",
      };
      return icons[type] || icons.success;
    },
  },
};
</script>

<style scoped>
/* Floating alert positioning */
.floating-alert {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  z-index: 9999 !important;
  min-width: 300px !important;
  max-width: 400px !important;
  margin: 0 !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

/* Alert styling for better contrast */
.custom-alert {
  border: 2px solid !important;
  padding: 12px 16px !important;
}

.error-alert {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  border-color: rgba(220, 38, 38, 0.4) !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2) !important;
}

.success-alert {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  border-color: rgba(22, 163, 74, 0.4) !important;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2) !important;
}

.warning-alert {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%) !important;
  border-color: rgba(217, 119, 6, 0.4) !important;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2) !important;
}

.info-alert {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  border-color: rgba(37, 99, 235, 0.4) !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2) !important;
}

.error-text {
  color: #ef4444 !important;
  font-weight: 400;
  font-size: 1rem;
}

.success-text {
  color: #22c55e !important;
  font-weight: 400;
  font-size: 1rem;
}

.warning-text {
  color: #f59e0b !important;
  font-weight: 400;
  font-size: 1rem;
}

.info-text {
  color: #3b82f6 !important;
  font-weight: 400;
  font-size: 1rem;
}

.alert-text {
  font-weight: 400;
  font-size: 1rem;
}

/* Icon styling for alerts */
.custom-alert .alert-main-icon {
  font-weight: bold;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.error-alert .alert-main-icon {
  color: #ef4444 !important;
}

.success-alert .alert-main-icon {
  color: #22c55e !important;
}

.warning-alert .alert-main-icon {
  color: #f59e0b !important;
}

.info-alert .alert-main-icon {
  color: #3b82f6 !important;
}

/* Animation for floating alert */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive design for mobile */
@media (max-width: 600px) {
  .floating-alert {
    top: 10px !important;
    right: 10px !important;
    left: 10px !important;
    min-width: auto !important;
    max-width: none !important;
  }
}
</style>
