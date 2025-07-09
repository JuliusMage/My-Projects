module.exports = {
  root: true, // Stop ESLint from looking further up the directory tree
  extends: ['../../.eslintrc.js'], // Extend the root ESLint config
  parserOptions: {
    project: 'tsconfig.json', // Path to your tsconfig.json
    tsconfigRootDir: __dirname, // Important for monorepos
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Backend specific rules can go here
    // For NestJS, these are common to turn off or adjust from stricter general configs:
    '@typescript-eslint/interface-name-prefix': 'off', // Often `IUser` is not used.
    '@typescript-eslint/explicit-function-return-type': 'off', // Can be verbose for controllers/services.
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Similar to above.
    '@typescript-eslint/no-explicit-any': 'warn', // Default is 'error', 'warn' is softer during dev.
    // Example: if you use decorators extensively and they cause lint issues with default rules
    // 'no-useless-constructor': 'off', // If decorators on constructors are common
    // '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Already in root, but can be specific
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'], // Ensure build output is ignored by this specific config
};
