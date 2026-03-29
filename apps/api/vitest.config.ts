import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config'],
    testTimeout: 30000,   // blockchain + DB calls need time
    hookTimeout: 30000,
    pool: 'forks',        // isolate each test file's DB state
  },
})
