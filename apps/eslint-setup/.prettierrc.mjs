import baseConfig from '@intune/prettier-config';

/** @type {import("prettier").Config} */
const config = {
    ...baseConfig, // ← Spread the shared config
    // Add or override whatever you need
    printWidth: 120,
    semi: true, // Example override
    singleQuote: true, // Another override
    overrides: [
        {
            files: '*.md',
            options: {
                tabWidth: 2
            }
        }
    ]
};

export default config;
