<template>
  <v-navigation-drawer
    v-if="isLoggedIn"
    v-model="drawerModel"
    temporary
    app
    style="background: linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)"
    class="border-e"
  >
    <v-list-item
      prepend-icon="mdi-transit-connection-variant"
      :title="'Secure File Transit System'"
      :subtitle="'Management System'"
      nav
      class="px-4 py-3"
      style="color: #64748b"
    >
    </v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list density="compact" nav class="px-2">
      <!-- Always show essential menus for all users -->
      <!-- <v-list-item
        prepend-icon="mdi-folder"
        title="Drive"
        :active="$route.name === 'Drive'"
        @click="$router.push('/drive')"
        class="mb-1 text-orange"
        rounded="lg"
      ></v-list-item> -->

      <v-list-item
        prepend-icon="mdi-book-open"
        title="Guide"
        class="mb-1"
        rounded="lg"
        :active="$route.name === 'Guide'"
        @click="$router.push('/guide')"
      ></v-list-item>

      <!-- Dynamic Menu Items from API -->
      <template v-if="filteredMenus && filteredMenus.length > 0">
        <!-- Divider between default menus and API menus -->
        <v-divider class="my-2"></v-divider>

        <v-list-item
          v-for="(menu, index) in filteredMenus"
          :key="menu?.menuId || menu?.id || index"
          :prepend-icon="getMenuIcon(menu?.name || menu?.title)"
          :title="menu?.name || menu?.title || 'Menu Item'"
          :to="menu?.route || menu?.path || '#'"
          class="mb-1"
          rounded="lg"
          :active="isActiveRoute(menu?.route || menu?.path)"
          @click="navigateToRoute(menu?.route || menu?.path)"
        ></v-list-item>
      </template>

      <!-- Additional fallback menu when no API menus -->
      <template v-if="!filteredMenus || filteredMenus.length === 0">
        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-file-multiple"
          title="File Management"
          class="mb-1"
          rounded="lg"
          :active="$route.name === 'FileManagement'"
          @click="$router.push('/filemanagement')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-download-multiple"
          title="Downloads"
          class="mb-1"
          rounded="lg"
          :active="$route.name === 'Downloads'"
          @click="$router.push('/downloads')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-download"
          title="Unduh Kode"
          class="mb-1"
          rounded="lg"
          :active="$route.name === 'DownloadCode'"
          @click="$router.push('/downloadcode')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Konfigurasi"
          class="mb-1"
          rounded="lg"
          :active="$route.name === 'Configuration'"
          @click="$router.push('/configuration')"
        ></v-list-item>
      </template>
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
    userMenus: {
      type: Array,
      default: () => [],
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
    // Filter out null/undefined menu items
    filteredMenus() {
      if (!this.userMenus || !Array.isArray(this.userMenus)) {
        return [];
      }

      const filtered = this.userMenus.filter((menu) => {
        // Filter out null, undefined, or empty objects
        return (
          menu !== null &&
          menu !== undefined &&
          typeof menu === "object" &&
          Object.keys(menu).length > 0 &&
          (menu.name || menu.title)
        ); // Must have at least a name or title
      });

      return filtered;
    },
  },
  methods: {
    // Get appropriate icon for menu based on name
    getMenuIcon(menuName) {
      // Return default icon if menuName is null/undefined
      if (!menuName) {
        return "mdi-menu";
      }

      const iconMap = {
        // Admin & User menus berdasarkan API endpoints
        Configs: "mdi-cog-outline", // /configs
        configs: "mdi-cog-outline",
        Config: "mdi-cog-outline", // Alternative naming
        config: "mdi-cog-outline",
        Konfigurasi: "mdi-cog-outline",
        konfigurasi: "mdi-cog-outline",

        "Order File": "mdi-file-download", // /file/get-csv
        "order file": "mdi-file-download",
        "Get CSV": "mdi-file-download", // Alternative naming
        "get csv": "mdi-file-download",
        "Pesan File": "mdi-file-download",
        "pesan file": "mdi-file-download",

        "Get Status": "mdi-information", // /file/get-status
        "get status": "mdi-information",
        "File Status": "mdi-information", // Alternative naming
        "file status": "mdi-information",
        "Dapatkan Status": "mdi-information",
        "dapatkan status": "mdi-information",

        Users: "mdi-account-group", // /users
        users: "mdi-account-group",
        "User List": "mdi-account-group", // Alternative naming
        "user list": "mdi-account-group",
        "Daftar Pengguna": "mdi-account-group",
        "daftar pengguna": "mdi-account-group",

        "Key Cache": "mdi-download", // /voltage-key-cache/download (deprecated)
        "key cache": "mdi-download",
        "Download Key Cache": "mdi-download", // Alternative naming (deprecated)
        "download key cache": "mdi-download",
        "Voltage Key Cache": "mdi-download", // Exact API naming (deprecated)
        "voltage key cache": "mdi-download",
        "Cache Kunci": "mdi-download",
        "cache kunci": "mdi-download",

        "Download Agent": "mdi-download", // New name
        "download agent": "mdi-download",
        "Agent Download": "mdi-download",
        "agent download": "mdi-download",
        "Unduh Agen": "mdi-download",
        "unduh agen": "mdi-download",

        Files: "mdi-file-multiple", // File Management
        files: "mdi-file-multiple",
        "File Management": "mdi-file-multiple",
        "file management": "mdi-file-multiple",
        "Manajemen File": "mdi-file-multiple",
        "manajemen file": "mdi-file-multiple",

        Downloads: "mdi-download-multiple", // Downloads menu
        downloads: "mdi-download-multiple",
        "Download Menu": "mdi-download-multiple",
        "download menu": "mdi-download-multiple",
        Unduhan: "mdi-download-multiple",
        unduhan: "mdi-download-multiple",

        // Static menus
        Configuration: "mdi-cog",
        configuration: "mdi-cog",
        Konfigurasi: "mdi-cog",
        konfigurasi: "mdi-cog",
        "Download Code": "mdi-download",
        "download code": "mdi-download",
        "Unduh Kode": "mdi-download",
        "unduh kode": "mdi-download",
        Guide: "mdi-book-open",
        guide: "mdi-book-open",
        Panduan: "mdi-book-open",
        panduan: "mdi-book-open",
        Drive: "mdi-folder",
        drive: "mdi-folder",
        "Folder Drive": "mdi-folder",
        "folder drive": "mdi-folder",
      };

      // Try multiple variations
      let icon =
        iconMap[menuName] ||
        iconMap[menuName.toLowerCase()] ||
        iconMap[menuName.replace(/\s+/g, "")] || // Remove spaces
        iconMap[menuName.toLowerCase().replace(/\s+/g, "")] || // Remove spaces and lowercase
        "mdi-menu";

      return icon;
    },

    // Check if route is active
    isActiveRoute(route) {
      if (!route) return false;
      return this.$route.path === route;
    },

    // Navigate to route
    navigateToRoute(route) {
      if (route && route !== "#" && route !== this.$route.path) {
        this.$router.push(route);
      }
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
  background-color: rgba(199, 210, 254, 0.15);
  cursor: pointer;
}

/* File Manager menu item colors */
.text-blue .v-list-item__prepend .v-icon {
  color: #a5b4fc !important;
}

.text-orange .v-list-item__prepend .v-icon {
  color: #fde68a !important;
}
</style>
