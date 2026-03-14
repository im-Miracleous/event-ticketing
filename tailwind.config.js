import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#7C3AED',
                    50:  '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },
                secondary: {
                    DEFAULT: '#EF4444',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                },
                dark: {
                    DEFAULT: '#0D0D1A',
                    50:  '#1A1A2E',
                    100: '#16213E',
                    200: '#0F3460',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
                'gradient-hero':    'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 50%, #4C1D95 100%)',
            },
            animation: {
                'float':      'float 6s ease-in-out infinite',
                'glow':       'glow 2s ease-in-out infinite alternate',
                'slide-up':   'slideUp 0.6s ease-out',
                'fade-in':    'fadeIn 0.8s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-20px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 20px #7C3AED' },
                    'to':   { boxShadow: '0 0 40px #A78BFA, 0 0 80px #7C3AED' },
                },
                slideUp: {
                    'from': { opacity: '0', transform: 'translateY(30px)' },
                    'to':   { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to':   { opacity: '1' },
                },
            },
        },
    },

    plugins: [forms],
};
