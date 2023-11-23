const path = require('path');

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.json',
        createDefaultProgram: true,
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    ignorePatterns: ['.eslintrc.js', '*.config.*', 'browser-matrix.js'],
    plugins: ['@typescript-eslint', 'import', 'prettier', 'react', 'react-hooks'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        curly: ['error', 'all'],
        quotes: ['error', 'single'],
        'no-alert': 'error',
        'no-console': 'error',
        'no-redeclare': 'error',
        'no-var': 'error',
        'no-param-reassign': 'error',
        'no-multi-spaces': 'error',
        'no-multiple-empty-lines': 'error',
        'no-trailing-spaces': 'error',
        'no-whitespace-before-property': 'error',
        'eol-last': ['error', 'always'],
        'line-comment-position': ['error', { position: 'above' }],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: ['block', 'block-like', 'return', 'class', 'export', 'for', 'while', 'if'],
            },
            {
                blankLine: 'always',
                prev: ['block', 'block-like', 'const', 'let', 'var'],
                next: '*',
            },
        ],
        'spaced-comment': ['error', 'always'],
        'import/no-cycle': ['error', { maxDepth: '∞' }],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                alphabetize: {
                    order: 'asc',
                },
                'newlines-between': 'always',
            },
        ],
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'no-template-curly-in-string': 'error',
        'prefer-destructuring': 'off',
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        'prettier/prettier': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/jsx-no-target-blank': 'off',
        'react/prefer-stateless-function': 'error',
        'react/display-name': 'off',
        semi: 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: ['typeLike'],
                format: ['PascalCase'],
                leadingUnderscore: 'allow',
            },
        ],
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx', '.scss', '.svg', '.png', '.jpg'],
        },
        react: {
            version: 'detect',
        },
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, 'tsconfig.json'),
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    },
    overrides: [
        {
            files: ['**/*.tsx'],
            rules: {
                'react/prop-types': 'off',
            },
        },
    ],
};
