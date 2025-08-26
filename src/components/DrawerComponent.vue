<template>
  <v-navigation-drawer
    v-if="isLoggedIn"
    v-model="drawerModel"
    permanent
    app
    color="grey-lighten-5"
    class="border-e"
  >
    <v-list-item
      prepend-icon="mdi-bank"
      :title="'Dashboard Cabang'"
      :subtitle="'BRI Management System'"
      nav
      class="px-4 py-3"
    >
    </v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list density="compact" nav class="px-2">
      <!-- Menu Items -->

      <v-list-item
        prepend-icon="mdi-folder"
        title="Folder BRIDrive"
        :active="$route.name === 'BRIDrive'"
        @click="$router.push('/bridrive')"
        class="mb-1 text-orange"
        rounded="lg"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-download"
        title="Download Code"
        class="mb-1"
        rounded="lg"
        :active="$route.name === 'DownloadCode'"
        @click="$router.push('/downloadcode')"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-book-open"
        title="Guide"
        class="mb-1"
        rounded="lg"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "DrawerComponent",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
    rail: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:drawer"],
  computed: {
    drawerModel: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.$emit("update:drawer", value);
      },
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
  cursor: pointer;
}

/* File Manager menu item colors */
.text-blue .v-list-item__prepend .v-icon {
  color: #60a5fa !important;
}

.text-orange .v-list-item__prepend .v-icon {
  color: #f59e0b !important;
}
</style>
