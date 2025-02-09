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
        background: {
          DEFAULT: "rgb(17, 24, 39)",
          gradient: "rgb(241,246,246)",
        },
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
        },
        input: {
          DEFAULT: "#1F2937",
          focus: "#818CF8",
        },
        text: {
          DEFAULT: "#1F2937",
          secondary: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          border: "rgba(255, 255, 255, 0.2)",
        },
        backdropBlur: {
          glass: "10px",
        },
      },
    },
  },
  plugins: [],
};
export default config;
