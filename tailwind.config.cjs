/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './js/**/*.js'],
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
