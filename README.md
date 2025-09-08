# Numera - Provider Checker Indonesia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Numera adalah aplikasi web untuk mengecek operator telepon seluler Indonesia secara real-time. Aplikasi ini menggunakan pendekatan brutalism design dengan antarmuka yang bold dan responsif.

## ✨ Fitur

- 🔍 **Pengecekan Real-time**: Cek operator telepon secara instan saat mengetik
- 📱 **Responsive Design**: Kompatibel dengan semua ukuran perangkat
- 🎨 **Brutalism UI**: Desain dengan gaya brutalism yang unik
- ⚡ **Performa Tinggi**: Dibangun dengan Vite untuk kecepatan optimal
- 🔒 **TypeScript**: Type safety untuk kode yang lebih robust
- 📋 **Copy to Clipboard**: Salin nomor telepon dengan mudah
- 🌐 **SEO Optimized**: Meta tags lengkap untuk search engine

## 🚀 Teknologi

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Font**: Bebas Neue (Google Fonts)
- **Linting**: ESLint
- **Package Manager**: pnpm

## 📋 Operator yang Didukung

- Telkomsel (0852, 0853, 0811, 0812, 0813, 0821, 0822, 0851)
- XL Axiata (0817, 0818, 0819, 0859, 0877, 0878, 0879)
- Indosat Ooredoo (0814, 0815, 0816, 0855, 0856, 0857, 0858)
- Three (0896, 0897, 0898, 0899)
- Axis (0831, 0838)
- Smartfren (0881, 0882, 0883, 0884)

## 🛠️ Instalasi

### Prasyarat

- Node.js (versi 18 atau lebih baru)
- pnpm (atau npm/yarn)

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/numera.git
   cd numera
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Jalankan development server**
   ```bash
   pnpm dev
   ```

4. **Buka browser**
   ```
   http://localhost:5173
   ```

## 📖 Penggunaan

1. Masukkan nomor telepon Indonesia di kolom input
2. Aplikasi akan secara otomatis mendeteksi operator saat Anda mengetik
3. Lihat hasil di bagian "Hasil Pencarian"
4. Klik tombol "Salin Nomor" untuk menyalin nomor yang sudah dinormalisasi
5. Gunakan tombol "Contoh" untuk mencoba nomor dari operator tertentu

## 🏗️ Struktur Proyek

```
numera/
├── public/
│   ├── favicon.ico
│   └── vite.svg
├── src/
│   ├── App.tsx          # Komponen utama aplikasi
│   ├── main.tsx         # Entry point React
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Type definitions
├── index.html           # Template HTML
├── package.json         # Dependencies dan scripts
├── tailwind.config.ts   # Konfigurasi Tailwind CSS
├── tsconfig.json        # Konfigurasi TypeScript
├── vite.config.ts       # Konfigurasi Vite
└── README.md            # Dokumentasi ini
```

## 🎨 Kustomisasi

### Menambah Operator Baru

Edit file `src/App.tsx` dan tambahkan prefix baru ke dalam `PREFIX_MAP`:

```typescript
const PREFIX_MAP: Record<string, string[]> = {
  "Telkomsel": [
    "0852","0853","0811","0812","0813","0821","0822","0851"
  ],
  "OperatorBaru": [
    "08xx","08yy" // Tambahkan prefix baru di sini
  ],
  // ... operator lainnya
};
```

### Mengubah Styling

Aplikasi menggunakan Tailwind CSS. Edit class di `src/App.tsx` untuk mengubah tampilan.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

## 👨‍💻 Author

**Nandan**
- GitHub: [@nandan](https://github.com/nandan)
- Twitter: [@nandan_dev](https://twitter.com/nandan_dev)

## 🙏 Ucapan Terima Kasih

- [React](https://reactjs.org/) - Library JavaScript untuk membangun antarmuka pengguna
- [Vite](https://vitejs.dev/) - Alat pengembangan frontend generasi berikutnya
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Bebas Neue Font](https://fonts.google.com/specimen/Bebas+Neue) - Font display dari Google Fonts

## 📞 Support

Jika Anda memiliki pertanyaan atau masalah, silakan buat [issue](https://github.com/yourusername/numera/issues) di GitHub.

---

⭐ **Beri bintang pada repo ini** jika Anda menyukai proyek ini!
