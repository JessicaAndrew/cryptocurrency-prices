export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          primary: '#0066cc',
          danger: '#ff3333',
          success: '#00cc66',
          dark: '#0a0e27',
          darker: '#050813',
        },
      },
    },
  },
  plugins: [],
}
