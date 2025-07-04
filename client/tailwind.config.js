/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#18181c',
        'cream': '#f8f5f2',
        'dusty-pink': '#f7d6e0',
        'ruby-accent': '#e94560',
        'mist-blue': '#6c7a89',
        'moody-purple': '#7c6eaa',
      },
    },
  },
  plugins: [],
}


