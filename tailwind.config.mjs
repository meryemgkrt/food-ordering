/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        screens: {
          xs: "375px",
          sm: "640px",
          lg: "768px",
          xl: "1170px",
          "2xl": "1170px",
        },
      },
      colors: {
        primary: "#ffbe33", // Ana vurgu rengi
        secondary: "#222831", // İkincil vurgu rengi
        accent: "#4ecdc4", // Dikkat çeken alanlar için
        neutral: "#f7f7f7", // Nötr arka plan rengi
        dark: "#1a202c", // Koyu tema rengi
        light: "#f9fafb", // Açık tema arka plan
        background: "var(--background)", // Tema desteği için
        foreground: "var(--foreground)", // Tema desteği için
        info: "#3ABFF8", // Bilgi mesajları için
        success: "#00FF00", // Başarılı işlemler için
        warning: "#FBBD23", // Uyarılar için
        danger: "#F87272", // Hatalar için
      
        // Eklenen kırmızı tonları
        red: {
          50: "#ffe5e7", // Çok açık kırmızı
          100: "#fdbfc2", // Açık kırmızı
          200: "#fc969c", // Orta açık kırmızı
          300: "#f86274", // Canlı kırmızı
          400: "#f42c4e", // Vurgu kırmızı
          500: "#e91236", // Yoğun kırmızı
          600: "#c10e2d", // Koyu kırmızı
          700: "#990b24", // Çok koyu kırmızı
          800: "#71081b", // Daha koyu kırmızı
          900: "#4a0512", // En koyu kırmızı
        },
        accentColor: {
          primary: '#ffbe33', // Accent rengini tanımlayın
          secondary: '#4CAF50',
        },
        crimson: "#DC143C", // Kraliyet kırmızısı
        ruby: "#9B111E", // Yakut kırmızısı
        firebrick: "#B22222", // Tuğla kırmızısı
        scarlet: "#FF2400", // Parlak kırmızı
        tomato: "#FF6347", // Domates kırmızısı
        maroon: "#800000", // Bordo
      },
      
      fontFamily: {
        electrolize: ["Electrolize", "sans-serif"],
        dancing: ["Dancing Script", "cursive"],
        sans: ["Open Sans", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
        button: "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      backgroundImage: {
        header: "url('/image/header.jpg')",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
