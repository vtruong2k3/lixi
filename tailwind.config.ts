import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF6B6B',
                    dark: '#E05555',
                    light: '#FF8787',
                },
                secondary: {
                    DEFAULT: '#4ECDC4',
                    dark: '#3DBDB4',
                    light: '#6ED9D0',
                },
                accent: '#FFE66D',
                success: '#27AE60',
                warning: '#F39C12',
                error: '#E74C3C',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
