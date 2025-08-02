const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities, matchUtilities, theme }) {
    addUtilities({
        '.bg-stripe-horizontal': {
            'background-image': `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px )`,
            'background-size': '14px 14px',
        },
        '.bg-stripe-vertical': {
            'background-image': `repeating-linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px )`,
            'background-size': '14px 14px',
        },
        '.bg-stripe-diagonal': {
            'background-image': `repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px )`,
            'background-size': '40px 40px',
        },
        '.bg-stripe-diagonal-fliped': {
            'background-image': `repeating-linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px )`,
            'background-size': '40px 40px',
        },
        '.bg-stripe-cross': {
            'background-image': `repeating-linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px ), repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 13px, var(--stripe-color) 13px, var(--stripe-color) 14px )`,
            'background-size': '40px 40px',
        },
    });
    matchUtilities(
        {
            'stripe-color': (value) => ({
                '--stripe-color': value,
            }),
        },
        {
            values: flattenColorPalette(theme('colors')),
            type: ['color'],
        }
    );
});

function flattenColorPalette(colors, prefix = '') {
    const result = {};
    for (const [key, value] of Object.entries(colors)) {
        if (typeof value === 'string') {
            result[prefix + key] = value;
        } else {
            Object.assign(result, flattenColorPalette(value, `${prefix}${key}-`));
        }
    }
    return result;
}
