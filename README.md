# Secure File Transit - Branch Dashboard

Aplikasi Vue 3 modern untuk Portal Secure File Transit dengan sistem Drive dan Download Center, dibangun menggunakan Vite dan Vuetify 3 untuk manajemen keamanan transmisi file.

## 🚀 Teknologi yang Digunakan

- **Vue 3** - Progressive JavaScript framework dengan Options API
- **Vite** - Fast build tool dan development server
- **Vuetify 3** - Material Design component framework untuk Vue
- **Vue Router 4** - Official router untuk Vue.js
- **Material Design Icons** - Comprehensive icon library

## 📦 Instalasi

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

## 🛠️ Development

Jalankan development server:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` atau port lain jika port tersebut sedang digunakan.

## 🏗️ Build

Build untuk production:

```bash
npm run build
```

Preview build production:

```bash
npm run preview
```

## 📁 Struktur Project

```
src/
├── components/          # Komponen Vue yang dapat digunakan kembali
│   ├── App.vue         # Root component aplikasi
│   ├── HeaderComponent.vue    # Header dengan navigation dan user controls
│   ├── DrawerComponent.vue    # Side navigation drawer
│   ├── FooterComponent.vue    # Footer aplikasi
│   ├── DriveComponent.vue      # Komponen utama Drive file management
│   ├── DownloadCodeComponent.vue # Download center untuk installer
│   └── LoginComponent.vue     # Halaman login
├── router/             # Konfigurasi Vue Router
│   └── index.js        # Setup routing dan navigation guards
├── plugins/            # Plugin konfigurasi
│   └── vuetify.js      # Konfigurasi Vuetify dan tema
├── styles/             # Global styles
│   └── main.css        # CSS utama
├── assets/             # Asset statis
├── App.vue             # Main app component
└── main.js             # Entry point aplikasi
```

## ✨ Fitur

### 🏦 Secure File Transit System

- 🔐 **Secure File Management** - Portal middleware untuk keamanan transmisi file
- 📁 **File Management System** - Manajemen file terenkripsi untuk Branch Office
- 🔗 **URL Folder Drive** - Akses cepat ke Google Drive folder terenkripsi
- 📋 **Copy to Clipboard** - Copy URL dengan satu klik
- 🔍 **File Search** - Pencarian file dengan real-time filtering
- 📊 **File Grid View** - Tampilan grid yang responsive untuk daftar file

### 💾 Download Center

- 🔑 **Access Code Management** - Show/hide access code dengan toggle
- 📥 **Download File Code** - Download file konfigurasi
- 🖥️ **Installer Agent Windows** - Download installer untuk Windows (122 MB)
- 🔐 **Key-Cache** - Download utility key-cache (2 MB)
- 📱 **Responsive Cards** - Layout card yang responsive dengan hover effects

### 🎨 UI/UX Features

- 🎨 **Material Design** - UI yang konsisten dan modern
- 📱 **Responsive Design** - Optimal di semua ukuran layar
- 🌙 **Dark/Light Theme** - Toggle tema gelap/terang
- 🧩 **Modular Components** - Komponen yang dapat digunakan kembali
- 🔔 **Notification System** - Toast notifications untuk feedback
- 🎯 **Interactive Elements** - Hover effects dan smooth transitions

### 🔐 Authentication & Navigation

- 🔒 **Login System** - Sistem autentikasi pengguna
- 🛡️ **Route Guards** - Proteksi halaman dengan authentication
- 🧭 **Navigation Drawer** - Side navigation dengan menu dinamis
- 👤 **User Management** - User profile dan logout functionality

### ⚡ Performance

- ⚡ **Hot Module Replacement** - Development yang cepat
- 📦 **Code Splitting** - Bundle yang optimal
- 🚀 **Optimized Build** - Build production yang teroptimasi

## 🎯 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build production

## 🔧 Konfigurasi

Project ini telah dikonfigurasi dengan:

- **Vite** dengan plugin Vue dan Vuetify
- **Vuetify 3** dengan tree-shaking dan auto-import
- **Vue Router 4** dengan navigation guards dan route protection
- **Options API** untuk konsistensi development pattern
- **Material Design Icons** untuk ikon yang comprehensive
- **Responsive Design System** dengan Vuetify grid
- **Component Architecture** yang modular dan maintainable

## 📱 Halaman & Komponen

### Halaman Utama

- **Login** (`/login`) - Halaman autentikasi pengguna
- **Drive** (`/drive`) - File management system utama
- **Download Code** (`/downloadcode`) - Download center untuk installer

### Komponen Utama

- **HeaderComponent** - App bar dengan theme toggle dan user menu
- **DrawerComponent** - Navigation sidebar dengan menu items
- **FooterComponent** - Footer dengan informasi aplikasi
- **DriveComponent** - File management interface
- **DownloadCodeComponent** - Download center interface

## 📝 Penggunaan

1. Buka browser dan akses `http://localhost:5173`
2. Login dengan kredensial yang valid
3. Navigasi ke **Drive** untuk file management:
   - Copy URL folder Drive
   - Search dan filter file
   - Select file untuk preview
4. Akses **Download Center** untuk download installer:
   - Show/hide access code
   - Download file konfigurasi
   - Download installer Windows dan Key-Cache
5. Toggle tema dengan tombol di header
6. Responsive design akan menyesuaikan dengan ukuran layar

## 🤝 Kontribusi

1. Fork project ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan license MIT.

## 🏢 Developer

Developed by IT Team untuk keperluan Portal Secure File Transit pada manajemen cabang.
