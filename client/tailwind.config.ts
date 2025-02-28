import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                rootColor: '#386cb2',
                hoverColor: '#f2f2f2',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            boxShadow: {
                'custom-light': '0 2px 5px rgba(0, 0, 0, 0.1)',
                'custom-medium': '0 4px 10px rgba(0, 0, 0, 0.2)',
                'custom-heavy': '0 8px 15px rgba(0, 0, 0, 0.3)',
            },
        },
    },
    plugins: [],
} satisfies Config;
