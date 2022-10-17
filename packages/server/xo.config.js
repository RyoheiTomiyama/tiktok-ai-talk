module.exports = {
  space: true,
  prettier: true,
  ignores: [
      './*config*',
  ],
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
        },
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
  },
}
