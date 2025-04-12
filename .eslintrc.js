module.exports = {
    env: {
        es6: true,
        browser: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            typescript: {
                project: './tsconfig.json',
                alwaysTryTypes: true,
            },
        },
        'import/ignore': ['node_modules'],
    },
    extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic',
        'plugin:import/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:tailwindcss/recommended',
    ],
    plugins: ['unused-imports', 'prettier'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'no-unused-vars': 'off',
        'react/self-closing-comp': [
            'warn',
            {
                component: true,
                html: true,
            },
        ],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            {vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'},
        ],
        'react/display-name': 'off',
        'react/no-array-index-key': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': [
            'error',
            {
                amd: true,
                commonjs: true,
            },
        ],
        'react/jsx-curly-brace-presence': ['error', 'never'],
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'import/newline-after-import': [
            'error',
            {
                count: 1,
            },
        ],
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: 'next',
                        group: 'external',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['internal'],
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
            },
        ],
        'padding-line-between-statements': [
            2,
            {
                blankLine: 'always',
                prev: 'import',
                next: '*',
            },
            {
                blankLine: 'any',
                prev: 'import',
                next: 'import',
            },
            {
                blankLine: 'always',
                prev: '*',
                next: ['const', 'let', 'var', 'export'],
            },
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var', 'export'],
                next: '*',
            },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var', 'export'],
                next: ['const', 'let', 'var', 'export'],
            },
            {
                blankLine: 'always',
                prev: '*',
                next: ['if', 'class', 'export', 'for', 'do', 'while', 'switch', 'try'],
            },
            {
                blankLine: 'always',
                prev: ['if', 'class', 'for', 'do', 'while', 'switch', 'try'],
                next: '*',
            },
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        'no-multi-spaces': 'error',
        'no-trailing-spaces': 'error',
        'prettier/prettier': 'error',
    },
};
