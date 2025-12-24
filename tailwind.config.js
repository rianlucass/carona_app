/** @type {import('tailwindcss').Config} */
module.exports = {  
  // NOTE: Update this to include the paths to all files that contain Nativewind classes. 
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}", 
    "./src/features/**/*.{js,jsx,ts,tsx}", 
    "./src/utils/**/*.{js,jsx,ts,tsx}", 
    "./src/screens/**/*.{js,jsx,ts,tsx}", 
    "./src/constants/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
    "./src/navigation/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{js,jsx,ts,tsx}"
  ],  
  theme: {    
    extend: {
      colors: {
        'primary': '#3b4f76',
        'primary-dark': '#2f3b52',
        'primary-darker': '#1e283c',
        'success': '#10b981',
        'border-custom': '#9ca3af',
        'text-secondary': '#7f8794',
        'bg-light': '#f5f7fa',
      },
    },  
  },  
  plugins: [],
}