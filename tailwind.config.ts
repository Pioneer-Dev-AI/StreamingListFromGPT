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
        flip: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(360deg)" },
        },
        "rocket-down": {
          "0%": { transform: "0" },
          "100%": {
            transform:
              "translateY(200px) translateX(200px) scale(0.2) rotate(120deg)",
          },
        },
      },
      animation: {
        "rocket-move": "rocket 2.2s linear infinite alternate-reverse",
        "rocket-go": "rocket-go 2.5s linear infinite",
        flip: "flip 0.5s forwards",
        "rocket-down": "rocket-down 4s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
