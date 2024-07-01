import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        playwrite: ["Playwrite AU QLD", "cursive"],
      },
      keyframes: {
        rocket: {
          "0%": { transform: "0" },
          "100%": { transform: "translateY(50px)" },
        },
        "rocket-go": {
          "0%": { transform: "0" },
          "100%": {
            transform: "translateY(-200px) translateX(200px) scale(0.2)",
          },
        },
      },
      animation: {
        "rocket-move": "rocket 2.5s linear infinite alternate",
        "rocket-go": "rocket-go 1s linear",
      },
    },
  },
  plugins: [],
} satisfies Config;
