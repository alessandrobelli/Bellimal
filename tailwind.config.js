module.exports = {
    content: [
        './src/**/*.{html,js,hbs}',
    ],
    theme: {
        extend: {
            colors: {
                anthracite: '#292C2F',
                orangeValencia: {
                    100: '#FEEAE6',
                    200: '#FDC6BE',
                    300: '#FBA296',
                    400: '#F97D6E',
                    500: '#F75946',
                    600: '#D84727', // Default color
                    700: '#A0361D',
                    800: '#682513',
                    900: '#301308',
                    DEFAULT: '#D84727',
                }
            },
            fontFamily: {
                body: ['"Fira Mono"', 'monospace'],
                heading: ['"Atkinson Hyperlegible"', 'sans-serif'],
            },
            scale: {
                '101': '1.01',
            }
        },
    },
    plugins: [],
};
