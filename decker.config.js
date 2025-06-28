module.exports = {
  // Project settings
  name: 'FaceBook',
  description: 'Facebook TypeScript Project',
  
  // Build settings
  build: {
    outputDir: 'dist',
    assetsDir: 'assets',
    publicPath: '/',
    sourceMap: true,
    minify: true
  },
  
  // Development server settings
  devServer: {
    port: 3000,
    host: 'localhost',
    hotReload: true,
    open: true
  },
  
  // TypeScript settings
  typescript: {
    strict: true,
    declaration: true,
    noImplicitAny: true,
    target: 'ES2020'
  },
  
  // Testing settings
  testing: {
    framework: 'jest',
    coverage: true,
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts']
  },
  
  // Linting settings
  linting: {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
};
