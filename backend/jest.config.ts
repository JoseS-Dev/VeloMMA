import type { Config } from 'jest';

process.env.NODE_ENV = 'test';

const config: Config = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'], 
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            decorators: true,
            tsx: true,
          },
          transform: {
            decoratorVersion: '2022-03',
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  slowTestThreshold: 15000,
  testTimeout: 30000,
};

export default config;