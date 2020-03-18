module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-nested-ternary': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'max-len': ['error', 80, { ignoreTrailingComments: true }],
    'no-multi-spaces': ['error', { exceptions: { VariableDeclarator: true } }],
    'prefer-promise-reject-errors': 'off',
    indent: ['error', 2, { SwitchCase: 0 }],
    'import/extensions': 'off',
    'vue/html-indent': ['error', 2, {
      alignAttributesVertically: false,
    }],
    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
    }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'eol-last': 'off',
      },
    },
    {
      files: ['*.spec.js'],
      globals: {
        mount: false,
        shallowMount: false,
        createLocalVue: false,
        nextTick: false,
      },
    },
  ],
};
