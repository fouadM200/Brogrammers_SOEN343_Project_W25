import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.js', '**/*.jsx'], // Target all JavaScript and JSX files
        ignores: ['node_modules/**'], // Ignore `node_modules`
        languageOptions: {
            ecmaVersion: 2021, // Enable modern JavaScript
            sourceType: 'module', // Use ES modules
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Enable JSX syntax
                },
            },
        },
        plugins: {
            react: reactPlugin, // React plugin
            prettier: prettierPlugin, // Prettier plugin
        },
        rules: {
            'react/react-in-jsx-scope': 'off', // Not needed for React 17+
            'react/prop-types': 'off', // Disable PropTypes enforcement
            'no-unused-vars': 'off', // Warn for unused variables
            'no-console': 'off', // Warn for console.log usage
            'no-debugger': 'error', // Disallow `debugger` statements
            eqeqeq: ['error', 'always'], // Enforce strict equality
            curly: ['error', 'all'], // Enforce curly braces for all control statements
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true, // Use single quotes
                    semi: true, // Enforce semicolons
                    tabWidth: 4, // Set tab width to 4
                    trailingComma: 'es5', // Add trailing commas in ES5-compliant syntax
                    bracketSpacing: true, // Add spaces inside brackets
                },
            ],
        },
    },
];
