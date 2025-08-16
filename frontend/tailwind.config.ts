import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage : {
        'login-background' : "url('/assets/images/bg-image-email-login2.jpg')"
      },
      keyframes: {
        slideIn: {
          '0%': {transform: "translateX(-100%)", opacity: '0'},
          '50%': {transform: "translateX(30%)", opacity: '0.5'},
          '100%': {transform: "translateX(0)", opacity: '1'}
        }
      },
      animation: {
        slideIn: 'slideIn 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
};
export default config;
