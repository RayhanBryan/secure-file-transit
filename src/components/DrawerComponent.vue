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
      :title="'Sistem Transit File Aman'"
      :subtitle="'Sistem Manajemen BRI'"
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
        title="BRIDrive"
        :active="$route.name === 'BRIDrive'"
        @click="$router.push('/bridrive')"
        class="mb-1 text-orange"
        rounded="lg"
      ></v-list-item> -->

      <v-list-item
        prepend-icon="mdi-book-open"
        title="Panduan"
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

      // Debug log to see what menus we have
      console.log("filteredMenus:", filtered);
      filtered.forEach((menu, index) => {
        console.log(`Menu ${index}:`, {
          name: menu.name,
          title: menu.title,
          menuName: menu.name || menu.title,
          route: menu.route || menu.path,
        });
      });

      return filtered;
    },
  },
  methods: {
    // Get appropriate icon for menu based on name
    getMenuIcon(menuName) {
      // Return default icon if menuName is null/undefined
      if (!menuName) {
        console.log("getMenuIcon: menuName is null/undefined");
        return "mdi-menu";
      }

      // Debug log to see what menu name we're getting
      console.log("getMenuIcon called with:", menuName);

      const iconMap = {
        // Admin & User menus berdasarkan API endpoints
        "Add Config": "mdi-plus-box", // /config/set
        "add config": "mdi-plus-box",
        "Set Config": "mdi-plus-box", // Alternative naming
        "set config": "mdi-plus-box",
        "Tambah Konfigurasi": "mdi-plus-box",
        "tambah konfigurasi": "mdi-plus-box",

        "Get Config": "mdi-cog-outline", // /config/get
        "get config": "mdi-cog-outline",
        "View Config": "mdi-cog-outline", // Alternative naming
        "view config": "mdi-cog-outline",
        "Lihat Konfigurasi": "mdi-cog-outline",
        "lihat konfigurasi": "mdi-cog-outline",

        "Add User": "mdi-account-plus", // /auth/register
        "add user": "mdi-account-plus",
        "Register User": "mdi-account-plus", // Alternative naming
        "register user": "mdi-account-plus",
        "Tambah Pengguna": "mdi-account-plus",
        "tambah pengguna": "mdi-account-plus",

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

        "Get Users": "mdi-account-group", // /get-users
        "get users": "mdi-account-group",
        "User List": "mdi-account-group", // Alternative naming
        "user list": "mdi-account-group",
        "Daftar Pengguna": "mdi-account-group",
        "daftar pengguna": "mdi-account-group",

        "Key Cache": "mdi-key", // /voltage-key-cache/download
        "key cache": "mdi-key",
        "Download Key Cache": "mdi-key", // Alternative naming
        "download key cache": "mdi-key",
        "Voltage Key Cache": "mdi-key", // Exact API naming
        "voltage key cache": "mdi-key",
        "Cache Kunci": "mdi-key",
        "cache kunci": "mdi-key",

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
        BRIDrive: "mdi-folder",
        bridrive: "mdi-folder",
        "Folder BRIDrive": "mdi-folder",
        "folder bridrive": "mdi-folder",
      };

      // Try multiple variations
      let icon =
        iconMap[menuName] ||
        iconMap[menuName.toLowerCase()] ||
        iconMap[menuName.replace(/\s+/g, "")] || // Remove spaces
        iconMap[menuName.toLowerCase().replace(/\s+/g, "")] || // Remove spaces and lowercase
        "mdi-menu";

      console.log("Icon found for", menuName, ":", icon);
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
