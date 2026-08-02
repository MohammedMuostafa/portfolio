/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './js/**/*.js'],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Cairo', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
};
