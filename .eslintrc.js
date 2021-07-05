module.exports = {
    'env': {
        'node': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'parser': '@babel/eslint-parser',
    'parserOptions': {
        'requireConfigFile': false,
        'sourceType': 'module',
        'allowImportExportEverywhere': false,
        'ecmaVersion': 6,
        'ecmaFeatures': {
            'globalReturn': false
        }
    },
    'rules': {
        'no-console': 'off',
        'no-unused-vars': ['error', { 'args': 'none' }],
        'require-atomic-updates': 'off',
        'indent': [
            'error',
            4
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'space-before-function-paren': [
            'error', {
                'anonymous': 'never',
                'named': 'never',
                'asyncArrow': 'always'
            }
        ],
        'space-unary-ops': [
            2,
            {
                'words': true,
                'nonwords': false,
                'overrides': {
                    'new': false
                }
            }
        ],
        'keyword-spacing': [
            'error', {
                'overrides': {
                    'if': { 'after': false },
                    'for': { 'after': false },
                    'while': { 'after': false },
                    'catch': { 'after': false },
                    'switch': { 'after': false }
                }
            }
        ],
        'no-trailing-spaces': [
            'error', {
                'skipBlankLines': false,
                'ignoreComments': false
            }
        ],
        'eqeqeq': [
            'error', 'smart'
        ],
        'spaced-comment': [
            'error', 'always',
            {
                'block': {
                    'exceptions': ['*']
                }
            }
        ],
        'comma-dangle': [
            'error', 'never'
        ],
        'no-multiple-empty-lines': [
            'error',
            {
                'max': 1,
                'maxEOF': 0
            }
        ],
        'no-multi-spaces': [
            'error',
            {
                'ignoreEOLComments': true,
                'exceptions': {
                    'AssignmentExpression': true,
                    'BinaryExpression': true,
                    'ConditionalExpression': true,
                    'LogicalExpression': true,
                    'JSXAttribute': true,
                    'Property': true,
                    'VariableDeclarator': true
                }
            }
        ]
    }
};
