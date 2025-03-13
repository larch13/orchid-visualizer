import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        'old-standard': ["var(--font-old-standard)", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
} satisfies Config;
