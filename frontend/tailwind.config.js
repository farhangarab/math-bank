export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#354254",
          primaryHover: "#2b3645",
          primaryDark: "#202834",
          surface: "#f7f9fc",
          borderSoft: "#d8dee8",
        },
        status: {
          errorBorder: "#fca5a5",
          errorBg: "#fef2f2",
          errorText: "#b91c1c",
          successBorder: "#86efac",
          successBg: "#f0fdf4",
          successText: "#15803d",
          warningBorder: "#fcd34d",
          warningBg: "#fffbeb",
          warningText: "#92400e",
          infoBorder: "#93c5fd",
          infoBg: "#eff6ff",
          infoText: "#1d4ed8",
        },
      },
      boxShadow: {
        button: "0 5px 0 #202834",
        buttonPressed: "0 0 0 #202834",
      },
    },
  },
  plugins: [],
}
